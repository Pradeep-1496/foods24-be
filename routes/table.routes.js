// routes/table.routes.js
const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');
const authRole = require('../middleware/authRole');

// POST /restaurant/tables
router.post('/tables', authRole('restaurant'), async (req, res) => {
  const { tables } = req.body;

  if (!Array.isArray(tables) || tables.length === 0) {
    return res.status(400).json({ error: 'Tables array is required' });
  }

  try {
    const restaurant = await Restaurant.findById(req.user.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const createdTables = [];

    for (const tableData of tables) {
      const newTable = await Table.create({
        tableNumber: tableData.tableNumber,
        qrCode: tableData.qrCode || '',
        status: tableData.status || 'available',
      });

      restaurant.tables.push(newTable._id);
      createdTables.push(newTable);
    }

    await restaurant.save();

    res.json({
      message: 'Tables added successfully',
      tables: createdTables,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
