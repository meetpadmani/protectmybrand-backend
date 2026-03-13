const axios = require('axios');
require('dotenv').config();

const test = async () => {
    console.log('Testing Trademark Lookup API with test-api.js format...');
    const options = {
        method: 'GET',
        url: 'https://trademark-lookup-api.p.rapidapi.com/google/namesearch/1/10',
        params: { name: 'TATA' },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'trademark-lookup-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log('Status:', response.status);
        console.log('Data (First 500 chars):', JSON.stringify(response.data).substring(0, 500));
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

test();
