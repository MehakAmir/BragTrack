const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();

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

router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or Password" });
            }

            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role, password: results[0].password }
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