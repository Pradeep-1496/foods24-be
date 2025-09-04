const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
