const mongoose = require('mongoose');

const BarberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    barbershop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barbershop',
        required: true
    }
}, {
    timestamps: true,
    collection: 'barbers'
});

module.exports = mongoose.model('Barber', BarberSchema);