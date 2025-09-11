const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'gerente'],
    default: 'gerente'
  },
  barbershop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbershop',
    required: function() { return this.role === 'gerente'; }
  }
}, {
  timestamps: true,
  collection: 'users'
});

module.exports = mongoose.model('User', UserSchema);