import * as admin from 'firebase-admin';
import { HttpsError } from "firebase-functions/v2/https";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

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

export { db, auth, sendEmail, stockPriceHelper };
