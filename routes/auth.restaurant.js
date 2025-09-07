const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";

// Restaurant Register


router.post("/register", async (req, res) => {
  const { email, password, r_name, location, phone } = req.body;

  try {
    // 1. Validate inputs
    if (!email || !password || !r_name || !phone || !location) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const existing = await Restaurant.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save restaurant
    const restaurant = await Restaurant.create({
      email,
      password: hashedPassword,
      r_name,
      location,
      phone,
    });

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: restaurant._id, email: restaurant.email }, // payload
      process.env.JWT_SECRET || "mysecret",           // secret key
      { expiresIn: "7d" }                             // token expiry
    );

    // 5. Send response with token + restaurant info
    res.status(201).json({
      message: "Restaurant registered successfully",
      token,
      restaurant: {
        id: restaurant._id,
        r_name: restaurant.r_name,
        email: restaurant.email,
        location: restaurant.location,
        phone: restaurant.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});




// Restaurant Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant)
      return res.status(401).json({ error: "Restaurant not found" });

    const match = await bcrypt.compare(password, restaurant.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { id: restaurant._id, role: "restaurant" },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
