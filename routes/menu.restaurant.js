const express = require('express');
const authRole = require('../middleware/authRole');
const Menu = require('../models/Menu');
const Item = require('../models/Item');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// POST /restaurant/menu - Create menu with items
router.post('/menu', authRole('restaurant'), async (req, res) => {
  const { items } = req.body; // Array of { name, price }

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  try {
    // Create item documents
    const itemDocs = await Item.insertMany(items);

    // Create menu with these items
    const menu = await Menu.create({ items: itemDocs.map(item => item._id) });

    // Link menu to restaurant
    await Restaurant.findByIdAndUpdate(req.user.id, { menu: menu._id });

    res.status(201).json({
      message: 'Menu created and items added successfully',
      menuId: menu._id,
      items: itemDocs
    });
  } catch (err) {
    console.error('Menu creation error:', err.message);
    res.status(500).json({ error: 'Failed to create menu' });
  }
});

module.exports = router;
