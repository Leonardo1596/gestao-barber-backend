const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
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
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  barbershop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbershop',
    required: true
  }
}, {
  timestamps: true,
  collection: 'services'
});

module.exports = mongoose.model('Service', ServiceSchema);
