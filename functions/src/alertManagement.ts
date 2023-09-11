//import * as logger from "firebase-functions/lib/logger";
import { onCall } from "firebase-functions/v2/https";

const helloWorld2 = onCall((request) => {
    //logger.info("Hello from helloWorld function", {structuredData: true});
    return "Hello from Firebase!";
});

export { helloWorld2 };
