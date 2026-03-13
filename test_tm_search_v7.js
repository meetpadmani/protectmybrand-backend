const axios = require('axios');
require('dotenv').config();

const test = async () => {
    console.log('Testing indian-trademarks-search-api.p.rapidapi.com with /wordmark endpoint...');
    const options = {
        method: 'GET',
        url: 'https://indian-trademarks-search-api.p.rapidapi.com/wordmark',
        params: { wordmark: 'TATA', page: 1 },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'indian-trademarks-search-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data).substring(0, 1000));
    } catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
};

test();
