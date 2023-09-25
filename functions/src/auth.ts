import { HttpsError, onCall } from "firebase-functions/v2/https";
import { auth } from "./helpers";
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

export { createAccount };
