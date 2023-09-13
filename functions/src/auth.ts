import {HttpsError, onCall} from "firebase-functions/v2/https";
import {auth} from "./helpers";

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
                    throw new HttpsError('already-exists', `Email ${request.data.email} in use`);
                }

                //functions.logger.log(`Error creating new user (not including email in use): ${JSON.stringify(error)}`);
                throw new HttpsError('internal', `Error creating account - please try again later`);
            });
    }
);

export {createAccount};
