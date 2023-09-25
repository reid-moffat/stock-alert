import { onCall } from "firebase-functions/v2/https";
import { db, stockPriceHelper } from "./helpers";
import * as admin from 'firebase-admin';

const getAlerts = onCall((request) => {
    return db.collection('alerts')
        // @ts-ignore
        .where('userId', '==', request.auth.uid)
        .get()
        .then((query) => {
            if (query.empty) {
                return [];
            }

            return query.docs.map(doc => ({...doc.data(), time: doc.data().time._seconds}));
        })
        .catch((err) => `Error getting alerts: ${err}`);
});

const getStockPrice = onCall({secrets: ["STOCK_API_URL", "STOCK_API_KEY", "STOCK_API_HOST"]},
    (request) => {
        return stockPriceHelper(request.data.ticker);
    });

const addAlert = onCall((request) => {
    const newAlert = {
        ticker: request.data.ticker,
        increase: true,
        target: request.data.target,
        time: admin.firestore.Timestamp.now(),
        active: true,
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

export { getAlerts, addAlert, deleteAlert, getStockPrice };
