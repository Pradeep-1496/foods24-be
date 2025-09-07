const express = require("express");
const multer = require("multer");
const path = require("path");
const Restaurant = require("../models/Restaurant");
const authRole = require("../middleware/authRole");

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure /uploads exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Get restaurant profile
router.get("/profile", authRole("restaurant"), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id).select("-password");
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ✅ Update restaurant profile (with optional image)
router.put(
  "/profile",
  authRole("restaurant"),
  upload.single("image"),
  async (req, res) => {
    try {
      const updates = req.body;
      if (req.file) {
        updates.image = `/uploads/${req.file.filename}`;
      }

      const restaurant = await Restaurant.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true }
      ).select("-password");

      res.json(restaurant);
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

// ✅ Delete restaurant profile
router.delete("/profile", authRole("restaurant"), async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.user.id);
    res.json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete profile" });
  }
});

module.exports = router;
