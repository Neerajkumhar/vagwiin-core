const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
console.log('Server file loaded. Starting setup...');
console.log('Attempting to listen on port:', process.env.PORT || 5000);

// AUTH ROUTES
const authRoutes = require('./routes/auth/authRoutes');

// ADMIN ROUTES
const productRoutes = require('./routes/admin/productRoutes');
const customerRoutes = require('./routes/admin/customerRoutes');
const adminOrderRoutes = require('./routes/admin/orderRoutes');
const settingsRoutes = require('./routes/admin/settingsRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

// USER ROUTES
const cartRoutes = require('./routes/user/cartRoutes');
const userOrderRoutes = require('./routes/user/orderRoutes');

// TECHNICIAN ROUTES
const warrantyRoutes = require('./routes/technician/warrantyRoutes');


const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/orders', userOrderRoutes);
app.use('/api/warranties', warrantyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/complaints', complaintRoutes);
// ADMIN SETTINGS
console.log('Registering settings routes...');
app.use('/api/admin/settings', settingsRoutes);


app.get('/', (req, res) => {
    res.send('Vagwiin Core API is running...');
});

// DB CONNECTION
const DB = process.env.MONGODB_URI;

mongoose.connect(DB, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
})
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => {
        console.error('CRITICAL: MongoDB connection error:', err.message);
        console.error('Please check if your IP is whitelisted in MongoDB Atlas.');
    });

// Connection Listeners
mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
