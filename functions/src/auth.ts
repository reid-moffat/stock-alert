import { HttpsError, onCall } from "firebase-functions/v2/https";
import { auth, sendEmail } from "./helpers";
import { logger }  from "firebase-functions";

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

const sendPasswordResetEmail = onCall(async (request) => {

    const emailAddress: string = request.data.email;
    const link: string = await auth.generatePasswordResetLink(emailAddress);

    const subject = 'Reset your password for Stock Alert';
    const body = `<p style="font-size: 16px;">A password reset request was made for your account</p>
                   <p style="font-size: 16px;">Reset your password here: ${link}</p>
                   <p style="font-size: 12px;">If you didn't request this, you can safely disregard this email</p>
                   <p style="font-size: 12px;">Best Regards,</p>
                   <p style="font-size: 12px;">-The Stock Alert team</p>`;

    return sendEmail(emailAddress, subject, body)
        .then(() => {
            logger.log(`Password reset email created for ${emailAddress}`);
            return `Password reset email created for ${emailAddress}`;
        })
        .catch((err) => {
            logger.log(`Error creating password reset email for ${emailAddress}: ${err}`);
            return `Error creating password reset email for ${emailAddress}`;
        });
});

export { createAccount, sendPasswordResetEmail };
