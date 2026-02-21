const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide customer name'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Offline', 'Flipkart', 'Amazon'],
        default: 'Offline'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    purchases: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: Number,
            price: Number,
            purchaseDate: {
                type: Date,
                default: Date.now
            }
        }
    ],
    totalSales: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
