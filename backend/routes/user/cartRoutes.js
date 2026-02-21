const express = require('express');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const { protect } = require('../../middleware/authMiddleware');
const router = express.Router();

// GET USER CART
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            // Create empty cart if not exists
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.status(200).json({
            status: 'success',
            data: { cart }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// ADD ITEM TO CART
router.post('/add', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity: quantity || 1 }]
            });
        } else {
            // Check if item already exists in cart
            const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity += (quantity || 1);
            } else {
                // Add new item
                cart.items.push({ product: productId, quantity: quantity || 1 });
            }
            await cart.save();
        }

        // Return populated cart
        const populatedCart = await cart.populate('items.product');

        res.status(200).json({
            status: 'success',
            data: { cart: populatedCart }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// REMOVE ITEM FROM CART
router.delete('/remove/:productId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ status: 'fail', message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        await cart.save();

        const populatedCart = await cart.populate('items.product');

        res.status(200).json({
            status: 'success',
            data: { cart: populatedCart }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// UPDATE ITEM QUANTITY
router.patch('/update', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ status: 'fail', message: 'Quantity must be at least 1' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ status: 'fail', message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ status: 'fail', message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const populatedCart = await cart.populate('items.product');

        res.status(200).json({
            status: 'success',
            data: { cart: populatedCart }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// CLEAR CART
router.delete('/clear', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ status: 'fail', message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            status: 'success',
            message: 'Cart cleared successfully'
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

module.exports = router;
