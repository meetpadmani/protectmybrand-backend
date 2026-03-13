const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const test = async () => {
    const q = 'TATA';
    const page = 1;
    const limit = 10;
    const options = {
        method: 'GET',
        url: `https://trademark-lookup-api.p.rapidapi.com/google/namesearch/${q}/${page}/${limit}`,
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'trademark-lookup-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        fs.writeFileSync('api_response_v8.json', JSON.stringify(response.data, null, 2));
        console.log('Success! Response saved to api_response_v8.json');
        if (response.data.list && response.data.list.length > 0) {
            console.log('First result markIdentification:', response.data.list[0].markIdentification);
        }
    } catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
};

test();
