import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
