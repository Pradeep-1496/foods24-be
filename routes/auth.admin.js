const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';

// Admin Registration
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashedPassword, name });

    res.status(201).json({ message: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Admin not found' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
