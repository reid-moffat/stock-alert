import * as admin from 'firebase-admin';
import {HttpsError} from "firebase-functions/v2/https";
import axios from "axios";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

const stockApiReq = {
    method: '',
    url: '',
    headers: {
        'X-RapidAPI-Key': '',
        'X-RapidAPI-Host': ''
    },
};

// Verifies a secret value is not null/undefined/empty
const verifySecrets = () => {

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

    // Setup API req data
    stockApiReq.method= 'GET';
    stockApiReq.url = process.env.STOCK_API_URL + '';
    stockApiReq.headers = {
        'X-RapidAPI-Key': process.env.STOCK_API_KEY + '',
        'X-RapidAPI-Host': process.env.STOCK_API_HOST + ''
    };
};

//
const stockPriceHelper = (ticker: string): Promise<String> => {

    if (stockApiReq.url === '' || stockApiReq.method === '') {
        throw new HttpsError('internal', "You need to call verifySecrets() before getStockPrice");
    }

    stockApiReq.url = process.env.STOCK_API_URL + ticker;

    return axios.request(stockApiReq).then(rsp => rsp.data.price);
};

// Sends
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

export { db, auth, verifySecrets, sendEmail, stockPriceHelper };
