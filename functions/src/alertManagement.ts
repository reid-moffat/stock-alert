//import * as logger from "firebase-functions/lib/logger";
import { onCall } from "firebase-functions/v2/https";
import {db} from "./helpers";
import * as admin from 'firebase-admin';

const getAlerts = onCall((request) => {
    return db.collection('alerts')
        // @ts-ignore
        .where('userId', '==', request.auth.uid)
        .get()
        .then((query) => query.empty? [] : query.docs.map(doc => doc.data()))
        .catch((err) => `Error getting alerts: ${err}`);
});

const addAlert = onCall((request) => {
    const newAlert = {
        ticker: request.data.ticker,
        increase: true,
        target: request.data.target,
        time: admin.firestore.Timestamp.now(),
        // @ts-ignore
        userId: request.auth.uid,
    };

    return db.collection('alerts')
        .add(newAlert)
        .then((docRef) => (docRef.id))
        .catch((e) => `Failed to add alert: ${JSON.stringify(e)}`);
});

const deleteAlert = onCall((request) => {
    const id = request.data.alertId;

    return db.collection('alerts')
        .doc(id)
        .delete()
        .then(() => `Successfully deleted alert with ID ${id}`)
        .catch((err) => `Error deleting alert with ID '${id}': ${err}`);
});

export { getAlerts, addAlert, deleteAlert };
