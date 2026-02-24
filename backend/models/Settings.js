const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'Vagwiin'
    },
    contactEmail: {
        type: String,
        default: 'support@vagwiin.com'
    },
    contactPhone: {
        type: String,
        default: '+91 1234567890'
    },
    address: {
        type: String,
        default: '123 Business Park, Sector 62, Noida, UP'
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    homepageBannerText: {
        type: String,
        default: 'Welcome to Vagwiin - Your Premium Heritage Partner'
    },
    currency: {
        type: String,
        default: 'INR'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
