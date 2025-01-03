const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jwt for generating tokens

// Explicitly define connection parameters
const pool = new Pool({
    user: String(process.env.PG_USER || ''),
    host: String(process.env.PG_HOST || 'localhost'),
    database: String(process.env.PG_DATABASE || ''),
    password: String(process.env.PG_PASSWORD || ''),
    port: parseInt(process.env.PG_PORT) || 5432,
});


pool.connect()
    .then(client => {
        console.log('Pool connected successfully');
        return client.query('SELECT NOW()')
            .then(res => {
                console.log('Database time:', res.rows[0]);
            })
            .finally(() => client.release());
    })
    .catch(err => {
        console.error('Pool connection error:', err.message);
    });

    
// Function to create a new user with hashed password
const createUser = async (username, email, hashedPassword, roles) => {
    console.log(`Creating user: ${username}, ${email}`);
    const query = `
        INSERT INTO users (username, email, password_hash, roles) 
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [username, email, hashedPassword, roles];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Function to check if a user exists by email
const getUserByEmail = async (email) => {
    console.log(`Checking if user exists with email: ${email}`);
    try {
        console.log("Attempting to query database...");
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('Database Query Successful. Result:', result.rows);
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching user by email:', err.message);
        console.error('Stack Trace:', err.stack);
        throw new Error('Error fetching user by email');
    }
};


// Function to validate the password
const validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword); // Compare plain password with hashed password
};

// Function to generate a JWT token
const generateJWT = (userId) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Function to handle user login
const loginUser = async (email, password) => {
    const user = await getUserByEmail(email); // Fetch user by email

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await validatePassword(password, user.password_hash); // Validate password

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    // If valid, generate and return JWT token
    const token = generateJWT(user.id);
    return { token, user };
};

module.exports = { createUser, getUserByEmail, loginUser };
