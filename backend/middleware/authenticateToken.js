const jwt = require('jsonwebtoken');

// Middleware to protect routes
function authenticateToken(req, res, next) {

    console.log('Headers:', req.headers);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("No token provided");
        res.status(401).json({ message: 'no token provided' });
    }
    console.log("Received token:", token);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            console.log("Token verification failed:", err);
            res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        console.log("Decoded user info:", user);
        next();
    });

}

module.exports = authenticateToken;


