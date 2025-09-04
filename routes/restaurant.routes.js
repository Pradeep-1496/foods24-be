const express = require('express');
const router = express.Router();

// ✅ Import Restaurant model
const Restaurant = require('../models/Restaurant');

// ✅ Import referenced models so populate() works!
require('../models/Table');
require('../models/Menu');

// ✅ GET restaurant with full menu and tables
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('tables')
      .populate('menu');

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ success: true, data: restaurant });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
