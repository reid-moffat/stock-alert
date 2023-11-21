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

            return query.docs.map(doc => {
                const alert = doc.data();
                return {
                    id: doc.id,
                    ticker: alert.ticker,
                    time: doc.data().time._seconds,
                    increase: alert.increase,
                    target: alert.target,
                    active: alert.active,
                };
            });
        })
        .catch((err) => `Error getting alerts: ${err}`);
});

const addAlert = onCall({ secrets: ["STOCK_API_URL", "STOCK_API_KEY", "STOCK_API_HOST"] },
    async (request) => {

    logger.info(`Starting function addAlert...`);

    const loggedIn = request.auth && request.auth.uid;
    if (!loggedIn) {
        if (!request.data.email) {
            throw new HttpsError('invalid-argument', `Must provide an email for non-logged in users`);
        }
    }

    logger.info(`Verifying ticker & target are valid...`);

    if (!request.data.ticker || !/[A-Z]+/.test(request.data.ticker)) {
        throw new HttpsError('invalid-argument', `Alert ticker invalid; must be all uppercase letters. Value: ${request.data.ticker}`);
    }
    if ((!/^[0-9]+(.[0-9]{2})?$/.test(request.data.target) && +request.data.target !== 0) || +request.data.target <= 0) {
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
    };
    if (loggedIn) {
        // @ts-ignore
        newAlert.userId = request.auth.uid;
        // @ts-ignore
        newAlert.email = (await auth.getUser(request.auth.uid)).email;
    } else {
        // @ts-ignore
        newAlert.email = request.data.email;
    }

    logger.info(`Adding alert object to database: ${JSON.stringify(newAlert)}`);
    return getCollection('/alerts/')
        .add(newAlert)
        .then((docRef) => (docRef.id))
        .catch((err) => {
            logger.error(`Failed to add alert: ${err}`);
            return `Failed to add alert; please try again later`;
        });
});

const deleteAlert = onCall(async (request) => {

    logger.info('Function deleteAlert starting, verifying params...')

    const id = request.data.alertId;

    if (!id) {
        logger.error(`request.data.alertId is not defined: ${id}`);
        throw new HttpsError('invalid-argument', `Must pass in an alert ID. Value: ${id}`);
    }
    const regex = "^[a-zA-Z0-9]{20}$";
    if (typeof id !== 'string' || !id.match(regex)) {
        logger.error(`request.data.alertId is not a string or doesn't match regex ${regex}`);
        throw new HttpsError('invalid-argument', 'Alert ID must be a 20-character long alphanumeric string');
    }

    logger.info(`Parameters passed verification, checking document is valid...`);

    await verifyDocPermission(request, `/alerts/${id}/`);

    const doc = await getDoc(`/alerts/${id}/`).get();

    // @ts-ignore
    if (!doc.data().active) {
        logger.error(`Document ${id} has already been triggered and can't be deleted`);
        throw new HttpsError('invalid-argument', `Document ${id} has already been triggered and can't be deleted`);
    }

    logger.info(`Document is valid, deleting...`);

    return getDoc(`/alerts/${id}/`)
        .delete()
        .then(() => {
            logger.info(`Successfully deleted alert with ID ${id}`);
            return `Successfully deleted alert with ID ${id}`;
        })
        .catch((err) => {
            logger.error(`Error deleting alert with ID '${id}': ${err}`)
            return `Error deleting alert with ID '${id}'`;
        });
});

export { getAlerts, addAlert, deleteAlert };
