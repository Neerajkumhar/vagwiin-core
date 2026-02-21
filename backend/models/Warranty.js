const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    planName: {
        type: String,
        required: true,
        default: 'Onsite Support',
        enum: ['Onsite Support', 'Premium Care Onsite Support', 'Premium Care Plus Support']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Active',
        enum: ['Active', 'Expired']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Warranty = mongoose.model('Warranty', warrantySchema);

module.exports = Warranty;
