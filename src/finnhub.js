const axios = require("axios").default;

/**
 * Returns the current price of a stock given its ticker
 * If the stock price cannot be obtained, an error value is returned
 */
const getPrice = async (ticker) => {
    // url for stock data
    const data = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.STOCK_API_KEY}`;

    // Get and return the stock price
    let resp = "";
    await axios.request({url: data}).then(response => {
        resp = response.data["c"];
        if(resp == "0") throw "Stock Ticker Invalid";
        if(response.data["status_code"] == "204") throw "Too Many API Calls";
    }).catch(error => {
        throw "Error getting stock price: " + error.message;
    });
    return resp;
};