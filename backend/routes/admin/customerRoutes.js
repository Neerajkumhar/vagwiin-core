const express = require('express');
const router = express.Router();
const Customer = require('../../models/Customer');
const Product = require('../../models/Product');
const { protect, admin } = require('../../middleware/authMiddleware');

// All routes are protected and for admins only
router.use(protect);
router.use(admin);

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().populate('purchases.product').sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            results: customers.length,
            data: { customers }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
});

// Create a customer with purchases and deduct stock
router.post('/', async (req, res) => {
    try {
        const { purchases, ...customerData } = req.body;
        let calculatedTotal = 0;

        // Process purchases and deduct stock
        if (purchases && purchases.length > 0) {
            for (const item of purchases) {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
                }

                // Deduct stock
                product.stock -= item.quantity;
                await product.save();

                // Calculate subtotal for this item if price not provided or to ensure accuracy
                const price = item.price || product.price;
                calculatedTotal += price * item.quantity;
            }
        }

        // Create customer with calculated total if not provided
        const newCustomer = await Customer.create({
            ...customerData,
            purchases: purchases || [],
            totalSales: customerData.totalSales || calculatedTotal
        });

        res.status(201).json({
            status: 'success',
            data: { customer: newCustomer }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
});

// Update a customer
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!customer) {
            return res.status(404).json({
                status: 'fail',
                message: 'No customer found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: { customer }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({
                status: 'fail',
                message: 'No customer found with that ID'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
});

module.exports = router;
