const express = require("express");
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const router = express.Router();

// Get restaurant by ID with menu
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("menu") // get menu
      .populate("tables"); // optional if you want tables too

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
