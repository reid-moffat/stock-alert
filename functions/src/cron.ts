import { onSchedule } from "firebase-functions/v2/scheduler";
import { getCollection, getDoc, plural, sendEmail, stockPriceHelper } from "./helpers";
import { logger } from "firebase-functions";
import { HttpsError } from "firebase-functions/v2/https";

/**
 * Every 5 minutes, check each active alert to see if the stock has hit the target
 */
const checkAlerts = onSchedule({
    schedule: '*/5 * * * *',
    secrets: ["STOCK_API_URL", "STOCK_API_KEY", "STOCK_API_HOST"]
}, async (event) => {

    logger.info(`===== Cron job checkAlerts starting (${new Date()}) =====`);

    let errorOccurred = false;
    let alertsSent = 0;

    logger.info("Querying all active alerts...");

    const activeAlerts = await getCollection('/alerts/')
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

    logger.info(`Successfully queried ${plural(activeAlerts.length, 'active alert')}`);

    for (const alert of activeAlerts) {
        try {
            const stockPrice = await stockPriceHelper(alert.ticker);

            if ((alert.increase === true && stockPrice > alert.target) || (alert.increase === false && stockPrice < alert.target)) {
                logger.info("");
                logger.info(`--- Stock alert '${alert.id}' (${alert.ticker} @$${alert.target}) triggered ---`);
                logger.info(`Sending email to ${alert.email}...`);
                const emailHtml = `Stock alert triggered!<br>Ticker: ${alert.ticker}<br>Current price: ${stockPrice}<br>Alert value: ${alert.target}`;
                await sendEmail(alert.email, `Stock alert for ${alert.ticker}!`, emailHtml);

                logger.info(`Deactivating alert in database...`);
                await getDoc(`/alerts/${alert.id}/`).update({ active: false });
                alertsSent++;

                logger.info(`Processing for alert ${alert.id} completed successfully`);
            }
        } catch (error) {
            errorOccurred = true;
            logger.error(`Error while checking alert with id '${alert.id}': ${error}`);
        }
    }

    if (errorOccurred) {
        throw new HttpsError('internal', "Error checking/sending alerts; see logs above");
    }

    if (alertsSent > 0) logger.info('');
    logger.info(`Cron job checkAlerts successfully completed. ${activeAlerts.length} alerts checked, ${plural(alertsSent, 'alert')} sent`);
    logger.info(`===== Cron job checkAlerts ending (${new Date()}) =====`);
});

export { checkAlerts };
