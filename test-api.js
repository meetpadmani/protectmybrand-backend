const axios = require('axios');
require('dotenv').config({ path: 'e:/protect my brand/backend/.env' });

const test = async () => {
    console.log('RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'Present' : 'Missing');
    console.log('RAPIDAPI_HOST:', process.env.RAPIDAPI_HOST);

    const options = {
        method: 'GET',
        url: 'https://trademark-lookup-api.p.rapidapi.com/google/namesearch/1/10',
        params: { name: 'Apple' },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        console.log('Status:', response.status);
        console.log('Keys:', Object.keys(response.data));
        console.log('Full Data (Sample):', JSON.stringify(response.data, null, 2).substring(0, 2000));
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

test();
