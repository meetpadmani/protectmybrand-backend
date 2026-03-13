const axios = require('axios');
require('dotenv').config();

const q = 'TATA';
const page = 1;
const limit = 10;

const testSearch = async () => {
    console.log('Testing Trademark Lookup API...');
    try {
        const response = await axios.request({
            method: 'GET',
            url: `https://trademark-lookup-api.p.rapidapi.com/google/namesearch/${encodeURIComponent(q)}/${page}/${limit}`,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'trademark-lookup-api.p.rapidapi.com',
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
