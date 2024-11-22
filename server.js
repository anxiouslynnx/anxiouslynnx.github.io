const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files (images, CSS, JS) directly from the current directory
app.use(express.static(path.join(__dirname)));

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ElysianRealm',
    password: 'LeviAckerman2002',
    port: 5432,
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    // Ensure password is not too short or empty
    if (!email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, username',
            [email, username, hashedPassword]
        );
        console.log(`User registered with ID: ${result.rows[0].id}`); // Log the user registration ID
        res.status(201).json({ userId: result.rows[0].id, username: result.rows[0].username });
    } catch (err) {
        console.error('Error during registration:', err);  // Log the error for debugging
        res.status(400).json({ error: 'An error occurred while registering' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', userId: user.id, username: user.username });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
