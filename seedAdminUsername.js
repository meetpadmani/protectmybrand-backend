const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdminUsername = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/protect_my_brand');

        console.log('Connected to database...');

        const admins = await User.find({ role: 'admin' });

        if (admins.length === 0) {
            console.log('No admin users found.');
            process.exit(0);
        }

        for (const admin of admins) {
            if (!admin.username) {
                admin.username = 'Nirav';
                await admin.save();
                console.log(`Updated admin ${admin.email} with username 'Nirav'`);
            } else {
                console.log(`Admin ${admin.email} already has username: ${admin.username}`);
            }
        }

        console.log('Seed completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin usernames:', error);
        process.exit(1);
    }
};

seedAdminUsername();
