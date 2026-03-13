const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Request Logging
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "img-src": ["'self'", "data:", "https://res.cloudinary.com", "https://upload.wikimedia.org"],
        },
    },
}));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = require('./db');

// Database connection
connectDB();

// Basic route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Protect My Brand API is running' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const trademarkRoutes = require('./routes/trademarkRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const clientLogoRoutes = require('./routes/clientLogoRoutes');
const trustPostRoutes = require('./routes/trustPostRoutes');
const searchRoutes = require('./routes/searchRoutes');
const blogRoutes = require('./routes/blogRoutes');

const SiteSettings = require('./models/SiteSettings');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/trademarks', trademarkRoutes);
app.use('/api/applications', applicationRoutes);
console.log('Registering /api/admin routes...');
app.use('/api/admin', adminRoutes);
console.log('/api/admin routes registered.');
app.use('/api/reviews', reviewRoutes);
app.use('/api/client-logos', clientLogoRoutes);
app.use('/api/trust-post', trustPostRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/blogs', blogRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Seed Site Settings
const seedSettings = async () => {
    try {
        const count = await SiteSettings.countDocuments();
        if (count === 0) {
            await SiteSettings.create({
                navbarLinks: [
                    { label: 'Home', path: '/' },
                    { label: 'About', path: '/about' },
                    { label: 'Packages', path: '/packages' },
                    { label: 'Marketplace', path: '/marketplace' }
                ],
                footerSections: [
                    {
                        title: 'Resources',
                        links: [
                            { label: 'About Us', path: '/about' },
                            { label: 'Buy Trademark', path: '#' },
                            { label: 'Sell Trademark', path: '#' },
                            { label: 'Legal Blog', path: '/blog' },
                            { label: 'Support', path: '#' }
                        ]
                    },
                    {
                        title: 'Our Services',
                        links: [
                            { label: 'Trademark Filing', path: '/packages' },
                            { label: 'Copyright Protection', path: '/packages' },
                            { label: 'Patent Registration', path: '/packages' },
                            { label: 'Startup India', path: '/packages' },
                            { label: 'Compliance', path: '/packages' }
                        ]
                    }
                ],
                contactInfo: {
                    address: "206 Sunrise Commercial Complex, Surat, Gujarat 394101",
                    phone: "+91 98796 20138",
                    email: "contact@protectmybrand.in"
                },
                visibility: {
                    '/': { showNavbar: true, showFooter: true },
                    '/about': { showNavbar: true, showFooter: true },
                    '/packages': { showNavbar: true, showFooter: true },
                    '/marketplace': { showNavbar: true, showFooter: true },
                    '/login': { showNavbar: false, showFooter: false },
                    '/register': { showNavbar: false, showFooter: false },
                    '/admin/login': { showNavbar: false, showFooter: false },
                    '/admin/setup': { showNavbar: false, showFooter: false },
                    '/dashboard': { showNavbar: false, showFooter: false }
                }
            });
            console.log('Site settings seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding site settings:', error);
    }
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    seedSettings();
});
