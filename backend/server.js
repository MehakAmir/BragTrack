require('dotenv').config();
const http = require('http');
const app = require('./index');
const server = http.createServer(app);
server.listen(process.env.PORT);


const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');


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
app.post('/api/achievements', (req, res) => {
    const { achievement, impact, description, date } = req.body;
    const sql = 'INSERT INTO achievements (achievement, impact, description, date) VALUES (?, ?, ?, ?)';
    db.query(sql, [achievement, impact, description, date], (err, result) => {
        if (err) throw err;
        res.send('Achievement added');
    });
});

// Get all achievements
app.get('/api/achievements', (req, res) => {
    const sql = 'SELECT * FROM achievements';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Update an achievement
app.put('/api/achievements/:id', (req, res) => {
    const { achievement, impact, description, date } = req.body;
    const sql = 'UPDATE achievements SET achievement = ?, impact = ?, description = ?, date = ? WHERE id = ?';
    db.query(sql, [achievement, impact, description, date, req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Achievement updated');
    });
});

// Delete an achievement
app.delete('/api/achievements/:id', (req, res) => {
    const sql = 'DELETE FROM achievements WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Achievement deleted');
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

