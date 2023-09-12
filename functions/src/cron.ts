import {onSchedule} from "firebase-functions/v2/scheduler";
import {db, stockPriceHelper, sendEmail, verifySecrets} from "./helpers";
import {logger} from "firebase-functions";

const checkAlerts = onSchedule({
    schedule: '*/5 * * * *',
    secrets: ["STOCK_API_URL", "STOCK_API_KEY", "STOCK_API_HOST"]
}, async (event) => {

    verifySecrets();

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
            const stockPrice = await stockPriceHelper(alert.ticker);

            if (alert.increase === true) {
                if (stockPrice > alert.target) {
                    await sendEmail(alert.userId, `Stock alert for ${alert.ticker}!`,
                        `Stock alert triggered!<br>Ticker: ${alert.ticker}<br>Current price: ${stockPrice}<br>Alert value: ${alert.target}`);

                    await db.collection("alerts").doc(alert.id).update({ active: false });
                }
            } else if (alert.increase === false) {
                if (stockPrice < alert.target) {
                    await sendEmail(alert.userId, `Stock alert for ${alert.ticker}!`,
                        `Stock alert triggered!<br>Ticker: ${alert.ticker}<br>Current price: ${stockPrice}<br>Alert value: ${alert.target}`);

                    await db.collection("alerts").doc(alert.id).update({ active: false });
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

export { checkAlerts };
