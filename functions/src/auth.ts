import { HttpsError, onCall } from "firebase-functions/v2/https";
import { auth, getCollection, getDoc, sendEmail } from "./helpers";
import { logger } from "firebase-functions";
import * as functions from "firebase-functions";

/**
 * Created a new user account (email & password)
 */
const createAccount = onCall((request) => {
    // Create user (will throw an error if the email is already in use)
    return auth
        .createUser({
            email: request.data.email,
            emailVerified: false,
            password: request.data.password,
            disabled: false,
        })
        .then(() => {
            return `Successfully created new user ${request.data.email}`;
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-exists') {
                logger.log(`User trying to create an account with an existing email: ${request.data.email}`);
                throw new HttpsError('already-exists', `Email ${request.data.email} in use`);
            }

            logger.log(`Error creating new user (not including email in use): ${error.message}`);
            throw new HttpsError('internal', `Error creating account - please try again later`);
        });
    }
);

/**
 * Automatically triggerred on user creation
 */
const onUserCreate = functions.auth.user().onCreate(async (user) => {
    if (user.email == null) {
        throw new HttpsError(
            'invalid-argument',
            `User email is null: ${JSON.stringify(user, null, 4)}`
        );
    }

    // Create a default db document for the user
    const defaultDoc = {
        email: user.email,
    };
    await getDoc(`/users/${user.uid}/`)
        .set(defaultDoc)
        .then(() => logger.info(`Default db data successfully created for user: ${user.uid}`))
        .catch((err) => {
            logger.error(`Error creating default db data for ${user.uid}: ${err}`);
            throw new HttpsError('internal', `Error creating default db data for ${user.uid}: ${err}`);
        });

    // Create a verification email
    const verifyLink = await auth
        .generateEmailVerificationLink(user.email)
        .then((link) => link)
        .catch((err) => {
            logger.error(`Error generating verification link: ${err}`);
            throw new HttpsError('internal', `Error generating verification link: ${err}`);
        });

    const emailHtml =
        `<p style="font-size: 16px;">Thanks for signing up!</p>
            <p style="font-size: 16px;">Verify your account here: ${verifyLink}</p>
            <p style="font-size: 12px;">If you didn't sign up, please disregard this email</p>
            <p style="font-size: 12px;">Best Regards,</p>
            <p style="font-size: 12px;">-The Stock Alert Team</p>`;

    return sendEmail(user.email, 'Verify your email for <i>Stock Alert</i>', emailHtml);
});

/**
 * Send an email with a link to reset their password to the specified user
 */
const sendPasswordResetEmail = onCall(async (request) => {

    const emailAddress: string = request.data.email;

    // If email doesn't exist, don't notify the user to prevent enumeration attacks
    const emailExists = await getCollection('/users/')
        .where('email', '==', 'emailAddress')
        .get()
        .then((result) => {
            if (result.docs.length === 0) {
                logger.info(`Requesting email ${emailAddress} does not exist`);
                return `If the email ${emailAddress} exists, a link was sent`;
            }
            return null;
        })
        .catch((err) => {
            logger.error(`Error checking if the email ${emailAddress} exists: ${err}`);
            throw new HttpsError('internal', 'Error creating email, please try again later');
        });

    if (emailExists !== null) return emailExists;

    // Generate link
    const link: string = await auth.generatePasswordResetLink(emailAddress)
        .catch((err) => {
            if (err.message === "RESET_PASSWORD_EXCEED_LIMIT") {
                logger.error('Too many password reset requests');
                throw new HttpsError('resource-exhausted', 'Too many password rest requests. Please try again later');
            }

            logger.error(`Error creating email link: ${err}`);
            throw new HttpsError('internal', 'Error creating email, please try again later');
        });
    logger.info(`Successfully generated password reset link ${link}`);

    // Construct email
    const subject = 'Reset your password for Stock Alert';
    const body = `<p style="font-size: 16px;">A password reset request was made for your account</p>
                   <p style="font-size: 16px;">Reset your password here: ${link}</p>
                   <p style="font-size: 12px;">If you didn't request this, you can safely disregard this email</p>
                   <p style="font-size: 12px;">Best Regards,</p>
                   <p style="font-size: 12px;">-The Stock Alert team</p>`;

    // Create email document & handle result
    return sendEmail(emailAddress, subject, body)
        .then(() => {
            logger.info(`Password reset email successfully created for ${emailAddress}`);
            return `If the email ${emailAddress} exists, a link was sent`;
        })
        .catch((err) => {
            logger.info(`Error creating password reset email for ${emailAddress}: ${err}`);
            throw new HttpsError('internal', 'Error creating email, please try again later');
        });
});

export { createAccount, onUserCreate, sendPasswordResetEmail };
