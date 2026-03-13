const axios = require('axios');
require('dotenv').config();

const q = 'TATA';

const testSearch = async () => {
    console.log('Testing Indian Trademarks Search API...');
    try {
        // Trying /trademarks/ or /search/ endpoints
        const response = await axios.request({
            method: 'GET',
            url: `https://indian-trademarks-search-api.p.rapidapi.com/trademarks/`,
            params: { q: q },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'indian-trademarks-search-api.p.rapidapi.com',
            },
            timeout: 10000
        });
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data).substring(0, 1000));
    } catch (error) {
        console.error('Error:', error.response?.status, error.message);
        if (error.response) console.log('Response Data:', error.response.data);
    }
};

testSearch();
