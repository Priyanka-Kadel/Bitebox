const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        next();
    }
    try {
        const verified = jwt.verify(
            token.split(' ')[1],
            process.env.JWT_SECRET || 'SECRETHO'
        );

        req.user = verified;
        next();
    } catch (err) {
       next();
    }
};

// Middleware to authorize roles
const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Access is restricted to specific roles' });
    }
    next();
};

module.exports = { verifyToken, authorizeRole };