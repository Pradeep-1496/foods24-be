const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

module.exports = mongoose.model('Menu', menuSchema);
