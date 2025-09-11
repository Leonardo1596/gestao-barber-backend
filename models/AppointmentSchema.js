const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  barbershop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbershop',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: true
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  }],
  date: {
    type: Date,
    required: true
  },
  hour: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  paymentMethod: {
    type: String,
    enum: ['dinheiro', 'cartao', 'pix'],
    default: 'dinheiro'
  },
  status: {
    type: String,
    enum: ['agendado', 'concluido', 'cancelado'],
    default: 'agendado'
  }
}, {
  timestamps: true,
  collection: 'appointments'
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
