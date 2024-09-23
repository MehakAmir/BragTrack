require('dotenv').config();
const http = require('http');
const app = require('./index');
const server = http.createServer(app);
server.listen(process.env.PORT);


const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticateToken = require('./middleware/authenticateToken');
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(bodyParser.json());
app.use(cors());


// Create connection to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'zoom1234', // replace with your MySQL password
    database: 'bragapp' // replace with your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
});

// Create Achievements table if it doesn't exist
app.get('/createAchievementsTable', (req, res) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS achievements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      achievement VARCHAR(255),
      impact TEXT,
      description TEXT,
      date DATE
    )
  `;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Achievements table created');
    });
});


// Insert a new achievement
app.post('/api/achievements', authenticateToken, (req, res) => {
    const { achievement, impact, tags, description, date } = req.body;
    const user_id = req.user.id; // Extract user_id from the token
    const sql = 'INSERT INTO achievements (achievement, impact,tags, description, date,user_id) VALUES (?, ?, ?,?,?,?)';
    db.query(sql, [achievement, impact, tags, description, date, user_id], (err, result) => {
        if (err) throw err;
        res.send('Achievement added');
    });
});

//Get achievements of user 
app.get('/api/achievements', authenticateToken, (req, res) => {
    const user_id = req.user.id;
    const sql = 'SELECT * FROM achievements WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching achievements:', err);
            return res.status(500).json({ error: 'Failed to fetch achievements' });
        }
        res.json(results);
    });
});

//update an achievement
app.put('/api/achievements/:id', (req, res) => {
    const id = req.params.id;
    const { achievement, impact, tags, description, date } = req.body;

    if (!id || !achievement || !impact || !tags || !description || !date) {
        return res.status(400).json({ error: 'ID and all fields are required' });
    }

    const sql = 'UPDATE achievements SET achievement = ?, impact = ?,tags =?, description = ?, date = ? WHERE id = ?';
    db.query(sql, [achievement, impact, tags, description, date, id], (err, result) => {
        if (err) {
            console.error('Error updating achievement:', err);
            return res.status(500).json({ error: 'Failed to update achievement' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        res.send('Achievement updated');
    });
});

// Delete an achievement
app.delete('/api/achievements/:id', (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    const sql = 'DELETE FROM achievements WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting achievement:', err);
            return res.status(500).json({ error: 'Failed to delete achievement' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        res.send('Achievement deleted');
    });
});

/// Fetch achievements with optional search and date filter
app.get('/api/achievements', (req, res) => {
    let { search, date } = req.query;
    let sql = 'SELECT * FROM achievements WHERE 1=1';
    let params = [];

    if (search) {
        sql += ' AND (achievement LIKE ? OR impact LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (date) {
        sql += ' AND date = ?';
        params.push(date);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching achievements:', err);
            return res.status(500).json({ error: 'Failed to fetch achievements' });
        }
        res.json(results);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/**
 * @swagger
 * /api/achievements:
 *   post:
 *     summary: Add a new achievement
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               achievement:
 *                 type: string
 *               impact:
 *                 type: string
 *               tags:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Achievement added
 *       500:
 *         description: Failed to add achievement
 */

// Get achievements of user
/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Get achievements of the authenticated user
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of achievements
 *       500:
 *         description: Failed to fetch achievements
 */

// Update an achievement
/**
 * @swagger
 * /api/achievements/{id}:
 *   put:
 *     summary: Update an achievement
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the achievement to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               achievement:
 *                 type: string
 *               impact:
 *                 type: string
 *               tags:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Achievement updated
 *       400:
 *         description: ID and all fields are required
 *       404:
 *         description: Achievement not found
 *       500:
 *         description: Failed to update achievement
 */

// Delete an achievement
/**
 * @swagger
 * /api/achievements/{id}:
 *   delete:
 *     summary: Delete an achievement
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the achievement to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Achievement deleted
 *       400:
 *         description: ID is required
 *       404:
 *         description: Achievement not found
 *       500:
 *         description: Failed to delete achievement
 */




