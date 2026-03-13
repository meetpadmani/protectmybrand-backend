const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Review = require('./models/Review');
const ClientLogo = require('./models/ClientLogo');

const seedDummyData = async () => {
    try {
        const reviewCount = await Review.countDocuments();
        if (reviewCount === 0) {
            await Review.create([
                { clientName: "Rahul Sharma", companyRole: "Founder, TechFlow", reviewText: "Protect My Brand made our trademark registration effortless. Their team is professional and very reactive.", rating: 5 },
                { clientName: "Priya Patel", companyRole: "CEO, GlowUp Cosmetics", reviewText: "Highly recommended for any startup looking to secure their intellectual property. The platform is very user-friendly.", rating: 5 },
                { clientName: "Amit Verma", companyRole: "Director, AeroBite Foods", reviewText: "Top-notch service. They handled our complex international registration with ease.", rating: 5 }
            ]);
            console.log('Dummy reviews seeded.');
        }

        const logoCount = await ClientLogo.countDocuments();
        if (logoCount === 0) {
            await ClientLogo.create([
                { clientName: "Google", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", logoPublicId: 'dummy_google' },
                { clientName: "Microsoft", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", logoPublicId: 'dummy_microsoft' },
                { clientName: "Apple", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", logoPublicId: 'dummy_apple' }
            ]);
            console.log('Dummy logos seeded.');
        }
    } catch (error) {
        console.error('Failed to seed dummy data:', error);
    }
};

const connectDB = async () => {
    try {
        console.log('Attempting to connect to primary MongoDB Atlas...');
        // Try connecting to the primary DB with a short timeout
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Increased timeout slightly
        });
        console.log('✅ MongoDB connected successfully to primary URI (Atlas)');
        await seedDummyData();
    } catch (err) {
        console.error('❌ Primary MongoDB connection failed:', err.message);
        console.log('Starting local fallback Database...');

        try {
            const dbPath = path.join(__dirname, 'mongo-data');
            if (!fs.existsSync(dbPath)) {
                fs.mkdirSync(dbPath, { recursive: true });
            }

            // Start an embedded mongodb instance
            const mongod = await MongoMemoryServer.create({
                instance: {
                    port: 27017,
                    dbPath: dbPath,
                    storageEngine: 'wiredTiger'
                }
            });

            const uri = mongod.getUri();
            console.log(`Local embedded Database successfully started!`);

            // Connect mongoose to the embedded instance
            await mongoose.connect(uri);
            console.log('✅ MongoDB connected securely to local fallback DB');
            await seedDummyData();
        } catch (fallbackErr) {
            console.error('❌ Failed to start local Database fallback:', fallbackErr.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
