import * as admin from 'firebase-admin';
import { HttpsError } from "firebase-functions/v2/https";
import axios from "axios";
import { CallableContext } from "firebase-functions/lib/common/providers/https";

// Initialize the app and required SDKs
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// Check if the requesting user is authenticated
const verifyIsAuthenticated = (request: CallableContext, name: string) => {
    if (!request.auth || !request.auth.uid) {
        throw new HttpsError(
            'unauthenticated',
            `You must be logged in to call the API endpoint ${name}`
        );
    }
};

// Gets the price of a stock
const stockPriceHelper = (ticker: string): Promise<String> => {

    // Verifies secret values are present
    const secrets: string[] = [
        "STOCK_API_URL",
        "STOCK_API_KEY",
        "STOCK_API_HOST"
    ];

    for (const secret of secrets) {
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
            'X-RapidAPI-Key': process.env.STOCK_API_KEY + '',
            'X-RapidAPI-Host': process.env.STOCK_API_HOST + ''
        },
    };

    return axios.request(stockApiReq).then(rsp => rsp.data.price);
};

// Sends an email with the given data to the given user ID
const sendEmail = async (recipient: string, subject: string, htmlBody: string) => {
    const email = {
        to: (await auth.getUser(recipient)).email,
        message: {
            subject: subject,
            html: htmlBody,
        },
    };

    await db
        .collection('emails')
        .add(email);
};

// Adds an s character if the given quantity is plural
const plural = (number: number, noun: string) => number === 1 ? number + noun : number + noun + 's';

export { db, auth, verifyIsAuthenticated, sendEmail, stockPriceHelper, plural };
