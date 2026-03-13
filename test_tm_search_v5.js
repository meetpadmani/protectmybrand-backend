const axios = require('axios');
require('dotenv').config();

const test = async () => {
    console.log('Testing Indian Trademarks Search API with namesearch format...');
    const options = {
        method: 'GET',
        url: 'https://indian-trademarks-search-api.p.rapidapi.com/google/namesearch/1/10',
        params: { name: 'TATA' },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'indian-trademarks-search-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log('Status:', response.status);
        console.log('Data (First 1000 chars):', JSON.stringify(response.data, null, 2).substring(0, 1000));
    } catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
};

test();
