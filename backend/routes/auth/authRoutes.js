const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const router = express.Router();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
    try {
        const { fullName, email, phone, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Prevent registration as admin (must be edited manually in DB as per user request)
        const userRole = role === 'admin' ? 'user' : role;

        const userObj = {
            fullName,
            email,
            phone,
            password,
            role: userRole || 'user'
        };
        console.log('Attempting to create user:', userObj);

        const newUser = await User.create(userObj);

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    phone: newUser.phone,
                    address: newUser.address,
                    role: newUser.role
                }
            }
        });
    } catch (err) {
        console.error('Signup Error:', err);
        let message = err.message;
        if (err.code === 11000) {
            message = 'Email already exists';
        }
        res.status(400).json({
            status: 'fail',
            message: message
        });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        // 3) If everything ok, send token to client
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role
                }
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// UPDATE PROFILE ROUTE
router.put('/update-profile', async (req, res) => {
    try {
        const { fullName, phone, address, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, phone, address },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    address: updatedUser.address,
                    role: updatedUser.role
                }
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// GET ALL TECHNICIANS
router.get('/technicians', async (req, res) => {
    try {
        const technicians = await User.find({ role: 'technician' });
        res.status(200).json({
            status: 'success',
            results: technicians.length,
            data: { technicians }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// ADD TECHNICIAN
router.post('/add-technician', async (req, res) => {
    try {
        const { fullName, email, phone, password, specialty } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const newTechnician = await User.create({
            fullName,
            email,
            phone,
            password,
            role: 'technician',
            specialty
        });

        res.status(201).json({
            status: 'success',
            data: {
                technician: {
                    id: newTechnician._id,
                    fullName: newTechnician.fullName,
                    email: newTechnician.email,
                    phone: newTechnician.phone,
                    role: newTechnician.role,
                    specialty: newTechnician.specialty
                }
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
});

// GET NOTIFICATIONS
router.get('/notifications', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            status: 'success',
            notifications: user.notifications
        });
    } catch (err) {
        console.error('Get Notifications Error:', err);
        if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.message.includes('buffering timed out')) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection failed.',
                error: err.message
            });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

// MARK NOTIFICATION AS READ
router.put('/notifications/:id/read', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const notification = user.notifications.id(req.params.id);
        if (notification) {
            notification.read = true;
            await user.save();
        }

        res.status(200).json({ status: 'success' });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
});

module.exports = router;
