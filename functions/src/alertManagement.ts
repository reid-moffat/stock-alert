import { onCall } from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v2/https";
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
import isNumber = require('is-number');

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

    logger.info(`Verifying input...`);
    if (!request.data.ticker || !/[A-Z]+/.test(request.data.ticker)) {
        throw new HttpsError('invalid-argument', `Alert ticker invalid; must be all uppercase letters. Value: ${request.data.ticker}`);
    }
    if (!/^[0-9]+.[0-9]{2}$/.test(request.data.target) && +request.data.target !== 0) {
        throw new HttpsError('invalid-argument', `Alert target must be a number. Value: ${request.data.target}`);
    }
    if (+request.data.target <= 0) {
        throw new HttpsError('invalid-argument', `Alert target must be a positive number. Value: ${request.data.target}`);
    }

    logger.info(`Verify stock ticker exists...`);
    await stockPriceHelper(request.data.ticker);

    logger.info(`Setting up alert object...`);
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

const deleteAlert = onCall(async (request) => {

    const id = request.data.alertId;
    await verifyDocPermission(request, `/alerts/${id}/`);

    return getDoc(`/alerts/${id}/`)
        .delete()
        .then(() => `Successfully deleted alert with ID ${id}`)
        .catch((err) => `Error deleting alert with ID '${id}': ${err}`);
});

export { getAlerts, addAlert, deleteAlert, getStockPrice };
