const mongoose = require('mongoose');
require('dotenv').config();
const SiteSettings = require('./models/SiteSettings');

const updateSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const settings = await SiteSettings.findOne();
        if (settings) {
            settings.footerSections.forEach(section => {
                section.links.forEach(link => {
                    if (link.label === 'Legal Blog') {
                        link.path = '/blog';
                    }
                });
            });
            await settings.save();
            console.log('✅ Site settings updated successfully');
        } else {
            console.log('❌ No site settings found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateSettings();
