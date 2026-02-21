const express = require('express');
const router = express.Router();
const Warranty = require('../../models/Warranty');
const Product = require('../../models/Product'); // Ensure Product model is loaded
const { protect, admin } = require('../../middleware/authMiddleware');

// @desc    Get all warranties
// @route   GET /api/warranties
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const warranties = await Warranty.find({})
            .populate('user', 'fullName email')
            .populate('product', 'name')
            .populate('order', '_id')
            .sort({ createdAt: -1 });
        res.json(warranties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get logged in user warranties
// @route   GET /api/warranties/mywarranties
// @access  Private
router.get('/mywarranties', protect, async (req, res) => {
    try {
        const warranties = await Warranty.find({ user: req.user._id })
            .populate('product', 'name image')
            .populate('order', '_id')
            .sort({ createdAt: -1 });
        res.json(warranties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Search warranty by serial number (Public)
// @route   GET /api/warranties/search/:serialNumber
// @access  Public
router.get('/search/:serialNumber', async (req, res) => {
    try {
        const warranty = await Warranty.findOne({ serialNumber: req.params.serialNumber })
            .populate('product', 'name images image')
            .select('-user -order'); // Don't expose user details publicly

        if (warranty) {
            res.json(warranty);
        } else {
            res.status(404).json({ message: 'Warranty not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Upgrade warranty plan
// @route   POST /api/warranties/upgrade
// @access  Private
router.post('/upgrade', protect, async (req, res) => {
    try {
        const { serialNumber, planName, durationYears } = req.body;

        const warranty = await Warranty.findOne({ serialNumber });
        if (!warranty) {
            return res.status(404).json({ message: 'Warranty not found' });
        }

        warranty.planName = planName;

        // Extend coverage if duration provided
        if (durationYears) {
            const newEndDate = new Date(warranty.endDate);
            newEndDate.setFullYear(newEndDate.getFullYear() + durationYears);
            warranty.endDate = newEndDate;
        }

        warranty.status = 'Active';
        await warranty.save();

        res.json({
            message: 'Warranty upgraded successfully',
            warranty
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
