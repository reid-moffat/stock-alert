import * as admin from 'firebase-admin';
import { HttpsError } from "firebase-functions/v2/https";
import axios from "axios";
import { CallableContext } from "firebase-functions/lib/common/providers/https";
import { logger } from "firebase-functions";

// Initialize the app and required SDKs
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// Helpers for getting a doc/collection
const getCollection = (path: string) => {
    if (!/^\/[a-zA-Z0-9]+\/(([a-zA-Z0-9]+\/){2})*$/.test(path)) {
        throw new HttpsError('internal', `Invalid collection path (${path}), see regex`);
    }

    return db.collection(path);
}
const getDoc = (path: string) => {
    if (!/^\/([a-zA-Z0-9]+\/){2}(([a-zA-Z0-9]+\/){2})*$/.test(path)) {
        throw new HttpsError('internal', `Invalid document path (${path}), see regex`);
    }

    return db.doc(path);
}

// Check if the requesting user is authenticated
const verifyIsAuthenticated = (request: CallableContext) => {
    if (!request.auth || !request.auth.uid) {
        throw new HttpsError(
            'unauthenticated',
            `You must be logged in to call the API`
        );
    }
};

// Verify the user who called the function has access to the specified job (authenticated + owns the doc)
const verifyDocPermission = async (context: CallableContext, path: string) => {
    verifyIsAuthenticated(context);

    await getDoc(path)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                throw new HttpsError(
                    'not-found',
                    `The document '${path}' does not exist`
                );
            }

            if (doc.data()?.userId !== context.auth?.uid) {
                throw new HttpsError(
                    'permission-denied',
                    `You cannot view the document '${path}' as it doesn't belong to you`
                );
            }
            return null;
        });
};

// Gets the price of a stock
const stockPriceHelper = async (ticker: string) : Promise<String> => {

    // Verifies secret values are present
    const requiredSecrets: string[] = [
        "STOCK_API_URL",
        "STOCK_API_KEY",
        "STOCK_API_HOST"
    ];

    for (const secret of requiredSecrets) {
        const secretValue: string | undefined = process.env[secret];

        if (secretValue === undefined) {
            throw new HttpsError('internal', `Secret value '${secret}' is undefined`);
        }
        if (secretValue === null) {
            throw new HttpsError('internal', `Secret value '${secret}' is null`);
        }
        if (secretValue.length === 0) {
            throw new HttpsError('internal', `Secret value '${secret}' is an empty string`);
        }
    }

    // Setup req
    const stockApiReq = {
        method: 'GET',
        url: process.env.STOCK_API_URL + ticker,
        headers: {
            'X-RapidAPI-Key': process.env.STOCK_API_KEY,
            'X-RapidAPI-Host': process.env.STOCK_API_HOST
        },
    };

    try {
        const rsp = await axios.request(stockApiReq);
        return rsp.data.price;
    } catch (err: any) {
        // Handle 404 errors specifically
        if (err.response && err.response.status === 404) {
            logger.info(`Attempted to check invalid stock ticker: ${ticker}`);
            throw new HttpsError('not-found', `Stock ticker ${ticker} is invalid`);
        }

        // For debugging, log the full error object in a safe way
        logger.error(`Error getting stock price for ${ticker}: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
        throw new HttpsError('internal', `Error getting stock price for ${ticker}, please try again later`);
    }
};

// Sends an email with the given data to the given user ID
const sendEmail = async (emailAddress: string, subject: string, htmlBody: string) => {
    const email = {
        to: emailAddress,
        message: {
            subject: subject,
            html: htmlBody,
        },
    };

    await getCollection('/emails/')
        .add(email);
};

// Adds an s character if the given quantity is plural
const plural = (number: number, noun: string) => number === 1 ? number + ' ' + noun : number + ' ' + noun + 's';

// Turns an object into a pretty string (ignores self-referencing loops)
const stringifyObject = (obj: object) => {
    const cache: any[] = [];
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.includes(value)) return; // Duplicate reference found, discard key
            cache.push(value); // Store value in our collection
        }
        return value;
    });
}

export { auth, getCollection, getDoc, verifyIsAuthenticated, verifyDocPermission, sendEmail, stockPriceHelper, plural };
