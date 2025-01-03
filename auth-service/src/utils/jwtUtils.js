const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.sign({ userId: user.id, roles: user.roles }, JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken };
