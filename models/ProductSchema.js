const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  barbershop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbershop',
    required: true
  }
}, {
  timestamps: true,
  collection: 'products'
});

module.exports = mongoose.model('Product', ProductSchema);
