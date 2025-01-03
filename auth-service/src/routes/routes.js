const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Example protected route
router.get('/protected', authenticate, authorize(['seller']), (req, res) => {
    res.json({ message: "You have access to this route", user: req.user });
});

module.exports = router;
