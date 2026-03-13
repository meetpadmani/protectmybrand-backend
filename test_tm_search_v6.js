const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const test = async () => {
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
        fs.writeFileSync('api_response.json', JSON.stringify(response.data, null, 2));
        console.log('Success! Response saved to api_response.json');
    } catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
};

test();
