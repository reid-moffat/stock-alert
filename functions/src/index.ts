/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import { addAlert, deleteAlert, getAlerts } from './alertManagement';
import { createAccount, onUserCreate, sendPasswordResetEmail } from "./auth";
import { checkAlerts, cleanOldData } from "./cron";

export {
    getAlerts,
    createAccount,
    onUserCreate,
    sendPasswordResetEmail,
    addAlert,
    deleteAlert,
    checkAlerts,
    cleanOldData,
};
