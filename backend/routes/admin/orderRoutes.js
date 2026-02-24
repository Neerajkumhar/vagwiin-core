const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Warranty = require('../../models/Warranty');
const Product = require('../../models/Product');
const { protect, admin } = require('../../middleware/authMiddleware');

// Helper function to deduct stock
const deductStock = async (order) => {
    if (order.stockDeducted) return;

    console.log(`[Inventory] Deducting stock for Order: ${order._id}`);
    for (const item of order.items) {
        try {
            const product = await Product.findById(item.product);
            if (product) {
                console.log(`[Inventory] Model: ${product.name}, Current Stock: ${product.stock}, Deducting: ${item.quantity}`);
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save();
                console.log(`[Inventory] New Stock for ${product.name}: ${product.stock}`);
            }
        } catch (err) {
            console.error(`[Inventory] ERROR deducting stock:`, err);
        }
    }
    order.stockDeducted = true;
};

const restoreStock = async (order) => {
    if (!order.stockDeducted) return;

    console.log(`[Inventory] Restoring stock for Order: ${order._id}`);
    for (const item of order.items) {
        try {
            const product = await Product.findById(item.product);
            if (product) {
                console.log(`[Inventory] Model: ${product.name}, Current Stock: ${product.stock}, Restoring: ${item.quantity}`);
                product.stock = product.stock + item.quantity;
                await product.save();
                console.log(`[Inventory] New Stock for ${product.name}: ${product.stock}`);
            }
        } catch (err) {
            console.error(`[Inventory] ERROR restoring stock:`, err);
        }
    }
    order.stockDeducted = false;
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'fullName email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const oldStatus = order.status;
            order.status = req.body.status || order.status;

            // STOCK DEDUCTION/RESTORATION LOGIC
            const isMovingToDeducted = ['Shipped', 'Delivered'].includes(order.status);
            const isMovingToRestored = ['Processing', 'Cancelled'].includes(order.status);

            if (isMovingToDeducted && !order.stockDeducted) {
                await deductStock(order);
            } else if (isMovingToRestored && order.stockDeducted) {
                await restoreStock(order);
            }

            // WARRANTY ACTIVATION (Only on Delivered)
            if (order.status === 'Delivered' && oldStatus !== 'Delivered') {
                for (const item of order.items) {
                    if (!item.serialNumbers || item.serialNumbers.length < item.quantity) {
                        return res.status(400).json({ message: `Missing model numbers for item: ${item.name}` });
                    }

                    for (const sn of item.serialNumbers) {
                        const existingWarranty = await Warranty.findOne({ serialNumber: sn });
                        if (!existingWarranty) {
                            const startDate = new Date();
                            const endDate = new Date();
                            endDate.setFullYear(endDate.getFullYear() + 1);

                            const warranty = new Warranty({
                                order: order._id,
                                user: order.user,
                                product: item.product,
                                serialNumber: sn,
                                planName: 'Onsite Support',
                                startDate,
                                endDate,
                                status: 'Active'
                            });
                            await warranty.save();
                        }
                    }
                }
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order serial numbers and set to Shipped
// @route   PUT /api/admin/orders/:id/serial-number
// @access  Private/Admin
router.put('/:id/serial-number', protect, admin, async (req, res) => {
    try {
        const { itemSerials } = req.body; // Expecting { itemId: [sn1, sn2], ... }
        if (!itemSerials) {
            return res.status(400).json({ message: 'Model numbers are required' });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            // Update serial numbers for each item
            for (const item of order.items) {
                if (itemSerials[item._id]) {
                    item.serialNumbers = itemSerials[item._id];
                }
            }

            // Set a primary serial for the order for display/backward compatibility
            const allSerials = order.items.flatMap(i => i.serialNumbers);
            if (allSerials.length > 0) {
                order.serialNumber = allSerials[0];
            }

            order.status = 'Shipped';

            // Deduct stock when shipped if not already deducted
            await deductStock(order);

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // Restore stock if it was deducted before deleting
            if (order.stockDeducted) {
                await restoreStock(order);
            }

            await Order.findByIdAndDelete(req.params.id);
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
