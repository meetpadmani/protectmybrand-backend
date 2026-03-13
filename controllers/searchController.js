const asyncHandler = require('express-async-handler');
const axios = require('axios');

// ─── Indian Trademark Mock Data (fallback) ────────────────────────────────────
const tmMockData = [
    { id: 1, title: 'ABC FOODS', applicant: 'XYZ Pvt Ltd', applicationNo: '4823156', class: '30', type: 'Word Mark', status: 'Registered', fileDate: '2021-03-10', description: 'Food products.' },
    { id: 2, title: 'ABC CAFE', applicant: 'Rahul Sharma', applicationNo: '3654210', class: '43', type: 'Word Mark', status: 'Applied', fileDate: '2023-07-22', description: 'Restaurant and cafe services.' },
    { id: 3, title: 'HARSH COLLECTION', applicant: 'Harsh Enterprises', applicationNo: '4823157', class: '25', type: 'Word Mark', status: 'Registered', fileDate: '2021-03-10', description: 'Clothing, footwear, headgear.' },
    { id: 4, title: 'RELIANCE FRESH', applicant: 'Reliance Retail Limited', applicationNo: '1923456', class: '35', type: 'Word Mark', status: 'Registered', fileDate: '2015-01-15', description: 'Retail store services.' },
    { id: 5, title: 'TATA SALT', applicant: 'Tata Chemicals Limited', applicationNo: '1029384', class: '30', type: 'Word Mark', status: 'Registered', fileDate: '2010-05-20', description: 'Salt, spices.' },
    { id: 6, title: 'AMUL', applicant: 'Gujarat Cooperative Milk Marketing Federation', applicationNo: '234501', class: '29', type: 'Word Mark', status: 'Registered', fileDate: '2005-03-11', description: 'Dairy products.' },
];

// Other category mock data
const otherMockData = {
    companies: [
        { id: 1, title: 'Reliance Industries Limited', number: 'L17110MH1973PLC019786', state: 'Maharashtra', status: 'Active' },
        { id: 2, title: 'Tata Consultancy Services Limited', number: 'L22210MH1995PLC084781', state: 'Maharashtra', status: 'Active' },
        { id: 3, title: 'Infosys Limited', number: 'L85110KA1981PLC013115', state: 'Karnataka', status: 'Active' },
        { id: 4, title: 'Protect My Brand Private Limited', number: 'U74999GJ2023PTC123456', state: 'Gujarat', status: 'Active' },
        { id: 5, title: 'HDFC Bank Limited', number: 'L65920MH1994PLC080618', state: 'Maharashtra', status: 'Active' },
    ],
    directors: [
        { id: 1, title: 'Mukesh Ambani', number: 'DIN: 00001695', compCount: 12, status: 'Active' },
        { id: 2, title: 'Ratan Tata', number: 'DIN: 00000001', compCount: 45, status: 'Active' },
        { id: 3, title: 'Narayana Murthy', number: 'DIN: 00002165', compCount: 8, status: 'Active' },
    ],
    patents: [
        { id: 1, title: 'A System for Efficient Data Processing', number: '202311001234', applicant: 'TCS', status: 'Published' },
        { id: 2, title: 'Novel Chemical Composition for Cleaning', number: '202221004567', applicant: 'Aashish Chemicals', status: 'Granted' },
    ],
    designs: [
        { id: 1, title: 'Bottle Design', number: '312345-001', applicant: 'Reliance', status: 'Registered' },
        { id: 2, title: 'Chair with Ergonomic Backrest', number: '345678-002', applicant: 'Godrej', status: 'Pending' },
    ],
    copyrights: [
        { id: 1, title: 'Protect My Brand Software Code', number: 'SW-12345/2023', author: 'Protect My Brand', status: 'Registered' },
        { id: 2, title: 'Aashish Music Album', number: 'SR-98765/2021', author: 'Aashish', status: 'Registered' },
    ],
};

// ─── Map Indian API result item to frontend format ────────────────────────────
const mapIndianTMResult = (item, idx) => {
    // Applicant / proprietor name
    const applicant =
        item.proprietor_name ||
        item.proprietor ||
        item.applicant_name ||
        item.applicant ||
        (item.proprietors && item.proprietors[0]?.name) ||
        'N/A';

    // Status
    const status =
        item.status ||
        item.tm_status ||
        item.current_status ||
        'N/A';

    // Class
    const tmClass =
        item.class_number ||
        item.class ||
        item.class_no ||
        (item.classes && item.classes[0]) ||
        'N/A';

    // Type / mark type
    const type =
        item.type_of_mark ||
        item.mark_type ||
        item.type ||
        'Word Mark';

    // Description (goods/services)
    const description =
        item.goods_and_services ||
        item.goods_services ||
        item.gs_description ||
        item.description ||
        '';

    // Filing / application date
    const fileDate =
        item.application_date ||
        item.date_of_application ||
        item.filing_date ||
        item.date ||
        'N/A';

    // Application number
    const applicationNo =
        item.application_number ||
        item.tm_number ||
        item.number ||
        String(item.id || `api-${idx}`);

    return {
        id: item.id || item.application_number || `api-${idx}`,
        title: item.word_mark || item.mark_name || item.title || item.name || 'N/A',
        applicant,
        applicationNo,
        class: String(tmClass),
        status,
        fileDate,
        description,
        type,
        logo: item.logo || item.image_url || null,
    };
};

// @desc    Global search for entities
// @route   GET /api/search/:category
// @access  Public
const globalSearch = asyncHandler(async (req, res) => {
    const { category } = req.params;
    // type can be: 'word_mark' | 'proprietor' | 'class' | 'status'
    const { q, page = 1, limit = 10, type = 'word_mark', status_filter, class_filter } = req.query;

    console.log(`[Search] category=${category} type=${type} q="${q}"`);

    if (!q || q.length < 2) {
        return res.json([]);
    }

    // ─── Indian Trademark API (Binbash Trademark Lookup) ──────────────────────
    if (category === 'trademarks' && process.env.RAPIDAPI_KEY) {
        try {
            // Using the Trademark Lookup API as hinted by the user
            // Endpoint format: /google/namesearch/:query/:page/:limit

            console.log(`[Trademark Lookup] Searching for: ${q}`);

            const response = await axios.request({
                method: 'GET',
                url: `https://trademark-lookup-api.p.rapidapi.com/google/namesearch/${encodeURIComponent(q)}/${page}/${limit}`,
                headers: {
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                    'x-rapidapi-host': 'trademark-lookup-api.p.rapidapi.com',
                },
                timeout: 10000
            });

            console.log('[Trademark Lookup Response] Status:', response.status);
            // Log a small piece of the data to see the structure
            console.log('[Trademark Lookup Response] Data Snapshot:', JSON.stringify(response.data).substring(0, 500));

            // The response might be an array or an object with a results/value property
            const resultsData =
                Array.isArray(response.data) ? response.data :
                    (response.data.results || response.data.value || response.data.list || []);

            if (resultsData.length > 0) {
                const mapped = resultsData.map(mapIndianTMResult);
                return res.json(mapped);
            }
            // No results → fall through to mock
        } catch (error) {
            console.error('[Trademark Lookup API Error]', error.response?.status, error.message);
            // Fall through to mock data
        }
    }

    // ─── Fallback: Mock Data ──────────────────────────────────────────────────
    const searchTerm = q.toLowerCase();

    if (category === 'trademarks') {
        const matches = tmMockData
            .filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.applicant.toLowerCase().includes(searchTerm)
            )
            .slice(0, parseInt(limit));
        return res.json(matches);
    }

    const dataSource = otherMockData[category];
    if (!dataSource) {
        return res.status(400).json({ message: 'Invalid search category.' });
    }

    const exactMatches = dataSource.filter(item => item.title.toLowerCase().startsWith(searchTerm));
    const partialMatches = dataSource.filter(item =>
        item.title.toLowerCase().includes(searchTerm) &&
        !item.title.toLowerCase().startsWith(searchTerm)
    );

    await new Promise(resolve => setTimeout(resolve, 300));
    return res.json([...exactMatches, ...partialMatches].slice(0, parseInt(limit)));
});

// @desc    Get Trademark Detail by ID
// @route   GET /api/search/trademark/:id
// @access  Public
const getTrademarkDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!process.env.RAPIDAPI_KEY) {
        return res.status(503).json({ message: 'API not configured.' });
    }

    try {
        const response = await axios.request({
            method: 'GET',
            url: `https://indian-trademarks-search-api.p.rapidapi.com/trademarks/${id}/`,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'indian-trademarks-search-api.p.rapidapi.com',
            },
            timeout: 10000
        });
        return res.json(response.data);
    } catch (error) {
        console.error('[TM Detail Error]', error.response?.status, error.message);
        return res.status(error.response?.status || 500).json({ message: 'Failed to fetch trademark details.' });
    }
});

// @desc    Get Trademark Documents by document_id
// @route   GET /api/search/trademark/documents?document_id=xxx
// @access  Public
const getTrademarkDocuments = asyncHandler(async (req, res) => {
    const { document_id } = req.query;

    if (!document_id) return res.status(400).json({ message: 'document_id is required.' });
    if (!process.env.RAPIDAPI_KEY) return res.status(503).json({ message: 'API not configured.' });

    try {
        const response = await axios.request({
            method: 'GET',
            url: 'https://indian-trademarks-search-api.p.rapidapi.com/trademarks/documents/',
            params: { document_id },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'indian-trademarks-search-api.p.rapidapi.com',
            },
            timeout: 10000
        });
        return res.json(response.data);
    } catch (error) {
        console.error('[TM Documents Error]', error.response?.status, error.message);
        return res.status(error.response?.status || 500).json({ message: 'Failed to fetch documents.' });
    }
});

module.exports = { globalSearch, getTrademarkDetail, getTrademarkDocuments };
