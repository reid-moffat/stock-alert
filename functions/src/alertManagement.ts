import { onCall } from "firebase-functions/v2/https";
import {
    auth,
    getCollection,
    getDoc,
    stockPriceHelper,
    verifyDocPermission,
    verifyIsAuthenticated
} from "./helpers";
import * as admin from 'firebase-admin';
import { logger }  from "firebase-functions";

const getAlerts = onCall((request) => {

    verifyIsAuthenticated(request);

    return getCollection('/alerts/')
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

        verifyIsAuthenticated(request);

        return stockPriceHelper(request.data.ticker);
    });

const addAlert = onCall({ secrets: ["STOCK_API_URL", "STOCK_API_KEY", "STOCK_API_HOST"] },
    async (request) => {

    logger.info(`Starting function addAlert...`);

    verifyIsAuthenticated(request);

    await stockPriceHelper(request.data.ticker);

    const newAlert = {
        ticker: request.data.ticker,
        increase: true,
        target: request.data.target,
        time: admin.firestore.Timestamp.now(),
        active: true,
        // @ts-ignore
        userId: request.auth.uid,
        // @ts-ignore
        email: (await auth.getUser(request.auth.uid)).email
    };

    logger.info(`Adding alert object to database: ${JSON.stringify(newAlert)}`);

    return getCollection('/alerts/')
        .add(newAlert)
        .then((docRef) => (docRef.id))
        .catch((e) => `Failed to add alert: ${JSON.stringify(e)}`);
});

const deleteAlert = onCall((request) => {

    verifyDocPermission(request, `/alerts/${request.data.alertId}/`);

    const id = request.data.alertId;

    return getDoc(`/alerts/${id}/`)
        .delete()
        .then(() => `Successfully deleted alert with ID ${id}`)
        .catch((err) => `Error deleting alert with ID '${id}': ${err}`);
});

// make an update alert function

export { getAlerts, addAlert, deleteAlert, getStockPrice };
