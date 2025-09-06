const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  // The 'items' field is an array of ObjectId references to the 'MenuItem' model.
  // This allows a single menu document to hold multiple menu item documents.
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
});

module.exports = mongoose.model("Menu", menuSchema);
