const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = require('../utils/nodemailer');



// Signup
router.post('/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({
        email,
        password: hashedPassword,
      });
  
      await user.save();
  
      // Send verification email
      const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      const verificationLink = `http://localhost:${process.env.PORT}/api/auth/verify-email/${verificationToken}`;
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`,
      });
  
      res.status(201).json({ message: 'User created successfully. Check your email for verification.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // ...
  

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Account not verified' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Email Verification
router.get('/verify-email/:token', async (req, res) => {
    const token = req.params.token;
  
    try {
      // Verify the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user and update verification status
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.isVerified = true;
      await user.save();
  
      res.json({ message: 'Email verification successful. You can now log in.' });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Invalid or expired token for email verification' });
    }
  });
  



// Endpoint to check email verification status
router.get('/check-verification', async (req, res) => {
  const { email } = req.query;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check the verification status
    const verified = user.isVerified;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    return res.json({token, verified });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


  // ...
  
module.exports = router;
