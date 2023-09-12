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

import { getAlerts, addAlert, deleteAlert, getStockPrice } from './alertManagement';
import { createAccount} from "./auth";
import { checkAlerts} from "./cron";

export { getAlerts, createAccount, addAlert, deleteAlert, checkAlerts, getStockPrice };
