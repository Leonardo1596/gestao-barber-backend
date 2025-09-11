const mongoose = require('mongoose');

const BarbershopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    openingTime: {
        type: String,
        required: true,
        default: '08:00',
    },
    closingTime: {
        type: String,
        required: true,
        default: '17:00',
    },
    lunchBreak: {
        start: { type: String, default: '12:00' },
        end: { type: String, default: '13:00' },
    }
}, {
    timestamps: true,
    collection: 'barbershops'
});

module.exports = mongoose.model('Barbershop', BarbershopSchema);
