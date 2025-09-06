const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  // The 'name' of the menu item, such as "Burger" or "Salad".
  name: { type: String, required: true },
  // The 'price' of the menu item.
  price: { type: Number, required: true },
  // Optional field to describe the item.
  description: { type: String },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
