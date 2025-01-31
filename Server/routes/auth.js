const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Customer = require('../models/Customer');
const router = express.Router();
const { JWT_SECRET } = process.env;
const authenticateToken = require('../middlewares/authenticateToken');

// Register
// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log(JSON.stringify(req.body)); // Logs the request body for debugging

  try {
    // Check if the username or email already exists (optional but recommended)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Create a new user and save it to the database
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Log the error to the server console for debugging
    console.error('Error registering user:', err);

    // If the error is a validation error or some other Mongoose error, we can catch it specifically
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: `Validation error: ${err.message}` });
    }

    // Catch any other errors and send a general error message
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Error logging in' });
    }
  });

  router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'You have accessed a protected route!', user: req.user });
  });
  
  // Verify Token
  router.get('/verify', (req, res) => {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ error: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ valid: true, userId: decoded.id });
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  });




  // Protected Routes
router.get('/customers', authenticateToken, async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.user.userId });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers' });
    }
});

router.post('/customers', authenticateToken, async (req, res) => {
    try {
        const { name, email, phone, notes } = req.body;
        const customer = new Customer({
            name,
            email,
            phone,
            notes,
            userId: req.user.userId
        });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer' });
    }
});
  
  module.exports = router;
  