const fetch = require('node-fetch');
const HTTPResponseError = require('../errors/http-response-error');

async function fetchData(url) {
    try {
        let response = await fetch(url);
        response = checkStatus(response);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

function checkStatus(response) {
    if (response.ok) {
        // response.status >= 200 && response.status < 300
        return response;
    } else {
        throw new HTTPResponseError(response);
    }
}

exports.checkStatus = checkStatus;
exports.fetchData = fetchData;