import * as admin from 'firebase-admin';
import {HttpsError} from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// Verifies a secret value is not null/undefined/empty
const verifySecret = (secret: any, name: any) => {
    if (secret === undefined) {
        throw new HttpsError('internal', `Secret value '${name}' is undefined`);
    }
    if (secret === null) {
        throw new HttpsError('internal', `Secret value '${name}' is null`);
    }
    if (typeof(secret) !== 'string') {
        throw new HttpsError('internal', `Secret value '${name}' is not a string`);
    }
    if (secret.length === 0) {
        throw new HttpsError('internal', `Secret value '${name}' is an empty string`);
    }
};

export { db, auth, verifySecret };
