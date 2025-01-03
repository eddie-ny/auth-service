require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});

client.connect()
    .then(() => {
        console.log('Database connected successfully');
        return client.query('SELECT NOW()');
    })
    .then((res) => {
        console.log('Database time:', res.rows[0]);
    })
    .catch((err) => {
        console.error('Database connection error:', err.message);
    })
    .finally(() => {
        client.end();
        console.log('Connection closed');
    });