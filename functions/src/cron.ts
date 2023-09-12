import {onSchedule} from "firebase-functions/v2/scheduler";
import {db, verifySecret} from "./helpers";
import axios from 'axios';
import {logger} from "firebase-functions";

const checkAlerts = onSchedule({
    schedule: '*/5 * * * *',
    secrets: ["STOCK_API_URL", "STOCK_API_KEY", "STOCK_API_HOST"]
}, async (event) => {

    // Make sure secrets are valid
    verifySecret(process.env.STOCK_API_URL, "STOCK_API_URL");
    verifySecret(process.env.STOCK_API_KEY, "STOCK_API_KEY");
    verifySecret(process.env.STOCK_API_HOST, "STOCK_API_HOST");

    let errorOccurred = false;

    const activeAlerts = await db.collection('alerts')
        .where('active', '==', true)
        .get()
        .then(alert => {
            if (alert.empty) return [];

            return alert.docs.map(doc => {
                const data = doc.data();
                data["id"] = doc.id;
                return data;
            })
        });

    for (const alert of activeAlerts) {
        try {
            const options = {
                method: 'GET',
                url: process.env.STOCK_API_URL + alert.ticker,
                headers: {
                    'X-RapidAPI-Key': process.env.STOCK_API_KEY,
                    'X-RapidAPI-Host': process.env.STOCK_API_HOST
                }
            };

            const stockPrice = await axios.request(options);

            if (alert.increase === true) {
                if (stockPrice > alert.target) {
                    // Send email
                }
            } else if (alert.increase === false) {
                if (stockPrice < alert.target) {
                    // Send email
                }
            } else {
                errorOccurred = true;
                logger.error(`Invalid alert.increase value for alert with id '${alert.id}': ${alert.increase}`);
            }
        } catch (error) {
            errorOccurred = true;
            logger.error(`Error while checking alert with id '${alert.id}': ${error}`);
        }
    }

    if (errorOccurred) {
        throw new Error("See logs above");
    }

    logger.info("Cron job checkAlerts successfully completed");
});

export {checkAlerts};
