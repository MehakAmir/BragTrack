const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
router.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));

/**
 *  @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully registered
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "successfully registered" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "email already exist" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })


})

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Incorrect username or password
 *       500:
 *         description: Internal server error
 */
router.post('/login', (req, res) => {
    const user = req.body;
    query = "select id,email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or Password" });
            }

            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role, password: results[0].password, id: results[0].id }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong.please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


/**
 * @swagger
 * /user/forgotPassword:
 *   post:
 *     summary: Request password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email exists for password reset
 *       400:
 *         description: Email not found
 *       500:
 *         description: Internal server error
 */

router.post('/forgotPassword', (req, res) => {
    const { email } = req.body;
    const query = "SELECT email FROM user WHERE email=?";
    connection.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (result.length > 0) {
            return res.status(200).json({ message: "Email exists. You can reset the password." });
        } else {
            return res.status(400).json({ message: "Email not found" });
        }
    });
});

/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     summary: Reset user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       500:
 *         description: Internal server error
 */
router.post('/resetPassword', (req, res) => {
    const { email, newPassword } = req.body;
    query = "update user set password=? where email=?";
    connection.query(query, [newPassword, email], (err, result) => {
        if (!err) {
            res.status(200).json({ message: "Password updated successfully" });
        } else {
            res.status(500).json(err);
        }
    });
});



module.exports = router;