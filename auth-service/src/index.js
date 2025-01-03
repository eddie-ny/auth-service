// index.js

// Import required libraries
const express = require('express');
const dotenv = require('dotenv');  // Import dotenv
const cors = require('cors');
const connectDB = require('./config/db'); // Your database connection
const authRoutes = require('./routes/routes'); // The routes you defined
// ../../.env

// Load environment variables
dotenv.config({ path: '../../.env' }); // Ensure dotenv is loaded before using process.env
// Log the entire process.env to see if it's being populated correctly
console.log(process.env);
console.log('Password:', process.env.PG_PASSWORD);



const app = express();
const { PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;  // Now you can safely access process.env


// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests

// Database connection
connectDB(); // Connect to your database (implement connectDB)

// Routes
app.use('/api', authRoutes); // All the auth routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
