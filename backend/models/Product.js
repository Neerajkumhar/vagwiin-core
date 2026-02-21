const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Please provide brand name'],
        trim: true
    },
    os: {
        type: String,
        trim: true
    },
    cpu: {
        type: String,
        required: [true, 'Please provide CPU details'],
        trim: true
    },
    gpu: {
        type: String,
        trim: true
    },
    display: {
        type: String,
        trim: true
    },
    storage: {
        type: String,
        required: [true, 'Please provide storage details'],
        trim: true
    },
    ram: {
        type: String,
        required: [true, 'Please provide RAM details'],
        trim: true
    },
    warranty: {
        type: String,
        trim: true
    },
    weight: {
        type: String,
        trim: true
    },
    connectivity: {
        type: String,
        trim: true
    },
    highlights: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        trim: true
    },
    images: {
        type: [String],
        default: []
    },
    grade: {
        type: String,
        enum: ['A', 'B', 'C', 'Premium'],
        default: 'A'
    },
    price: {
        type: Number,
        required: [true, 'Please provide price']
    },
    stock: {
        type: Number,
        required: [true, 'Please provide initial stock'],
        default: 0
    },
    status: {
        type: String,
        enum: ['Available', 'Low Stock', 'Out of Stock'],
        default: 'Available'
    },
    rating: {
        type: Number,
        default: 4.5
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update status based on stock before saving
productSchema.pre('save', function () {
    if (this.stock <= 0) {
        this.status = 'Out of Stock';
    } else if (this.stock < 5) {
        this.status = 'Low Stock';
    } else {
        this.status = 'Available';
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
