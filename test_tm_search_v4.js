const axios = require('axios');
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
        console.log('Status:', response.status);
        if (response.data) {
            // Find where the actual trademark list is
            const keys = Object.keys(response.data);
            console.log('Root keys:', keys);
            
            let list = response.data.body || response.data.results || response.data;
            if (Array.isArray(list)) {
                console.log('List length:', list.length);
                console.log('First item sample:', JSON.stringify(list[0], null, 2));
            } else {
                 console.log('Response structure:', JSON.stringify(response.data, null, 2).substring(0, 1000));
            }
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

test();
