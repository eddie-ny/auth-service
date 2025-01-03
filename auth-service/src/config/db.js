// require('dotenv').config();
const { Client } = require('pg');  // PostgreSQL client

const dotenv = require('dotenv');  // Import dotenv
dotenv.config({ path: './.env' });
// dotenv.config({ path: '../../.env' });
const connectDB = async () => {
    console.log("Starting DB connection...");

    // Force-cast environment variables to strings
    const PG_USER = String(process.env.PG_USER || '');
    const PG_PASSWORD = String(process.env.PG_PASSWORD || '');
    const PG_HOST = String(process.env.PG_HOST || 'localhost');
    const PG_DATABASE = String(process.env.PG_DATABASE || '');
    const PG_PORT = parseInt(process.env.PG_PORT) || 5432;

    console.log("DB_USER:", PG_USER);
    console.log("DB_PASSWORD:", PG_PASSWORD);

    // const client = new Client({
    //     user: 'postgres', // Hardcoded username
    //     host: 'localhost',
    //     database: 'multi_vendor_platform', // Hardcoded database name
    //     password: 'edward', // Hardcoded password
    //     port: 5432,
    // });

    const client = new Client({
        user: PG_USER,
        host: PG_HOST,
        database: PG_DATABASE,
        password: PG_PASSWORD,
        port: PG_PORT,
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
        const res = await client.query('SELECT NOW()');
        console.log('Database time:', res.rows[0]);
    } catch (err) {
        console.error('Database connection error:', err.message);  // Add clearer error message
    } finally {
        await client.end();
        console.log('Database connection closed');
    }
};

module.exports = connectDB;
connectDB();
