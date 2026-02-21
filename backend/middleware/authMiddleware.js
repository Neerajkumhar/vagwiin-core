const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verification token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token no longer exists.'
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);

        // Handle JWT errors
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid or expired token. Please log in again.'
            });
        }

        // Handle Database connection issues (Mongoose errors)
        if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.message.includes('buffering timed out')) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection failed. Please check your network or MongoDB Atlas whitelist.',
                error: err.message
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Internal server error during authentication.',
            error: err.message
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
