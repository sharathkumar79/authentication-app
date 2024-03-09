// authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // console.log(req.header('Authorization'));
    const token = req.header('Authorization')?.split(' ')[1];
    console.log(token);
    if ( token === "") {
      console.log("hello ",token);
    return res.status(401).json({ msg: 'You need to login to access this page' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = authMiddleware;
