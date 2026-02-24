const express = require('express');
const Settings = require('../../models/Settings');
const { protect, admin } = require('../../middleware/authMiddleware');
const router = express.Router();

// GET GLOBAL SETTINGS (Public - for frontend use as well)
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await Settings.create({});
        }
        res.status(200).json({
            status: 'success',
            data: { settings }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// UPDATE GLOBAL SETTINGS (Protected - Admin only)
router.put('/', protect, admin, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findOneAndUpdate({}, req.body, {
                new: true,
                runValidators: true
            });
        }
        res.status(200).json({
            status: 'success',
            data: { settings }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

module.exports = router;
