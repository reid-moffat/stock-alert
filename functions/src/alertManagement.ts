//import * as logger from "firebase-functions/lib/logger";
import { onCall } from "firebase-functions/v2/https";
import {db} from "./helpers";

const getAlerts = onCall((request) => {

    return db.collection('jobs')
        // @ts-ignore
        .where('userId', '==', request.auth.uid)
        .get()
        .then(async (query) => query.empty? [] : query.docs)
        .catch((err) => `Error getting alerts: ${err}`);
});

export { getAlerts };
