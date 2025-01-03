const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail } = require('../models/userModel');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');

const register = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = await createUser(username, email, hashedPassword, roles);

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error('Registration error:', error.message); // Log the error message
        console.error(error.stack); // Log the full stack trace

        // Send a more detailed response
        res.status(500).json({
            error: "Registration failed",
            details: error.message // Include error details
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user by email
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password_hash); // Use password_hash instead of password
        if (!isPasswordValid) return res.status(400).json({ error: "Invalid credentials" });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Login error:', error.message); // Log the error message
        console.error(error.stack); // Log the full stack trace
        res.status(500).json({ error: "Login failed" });
    }
};

module.exports = { register, login };
