const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password: hashedPassword, name, phone });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    // extract the error message
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
