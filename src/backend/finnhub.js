const axios = require("axios").default;

/**
 * Returns the current price of a stock given its ticker
 * If the stock price cannot be obtained, an error value is returned
 */
const getPrice = async (ticker) => {
    // url for stock data

    const data = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c7qcivqad3i9it665jk0`;
    console.log(ticker)
    // Get and return the stock price
    let resp = "";
    await axios.request({url: data}).then((response) => {
        console.log(response)
        resp = response.data["c"];
        if (resp === "0") throw "Stock Ticker Invalid";
        if (response.data["status_code"] === "204") throw "Too Many API Calls";
    }).catch(error => {
        throw "Error getting stock price: " + error.message;
    });
    return resp;
};

export default getPrice;
