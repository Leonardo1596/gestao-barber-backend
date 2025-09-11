const Appointment = require('../models/AppointmentSchema');
const Barbershop = require('../models/BarbershopSchema');
const { getAvailableSlots } = require('../utils/getAvailableSlots');

const availableSlotsService = async ({ date, barber, barbershop }) => {
    // Find barbershop by id
    const barbershopDoc = await Barbershop.findById(barbershop);
    const allSlots = getAvailableSlots(barbershopDoc.openingTime, barbershopDoc.closingTime, barbershopDoc.lunchBreak.start, barbershopDoc.lunchBreak.end);

    const appointments = await Appointment.find({
        date,
        barber
    });

    const bookedSlots = [];

    for (const appointment of appointments) {
        const start = appointment.hour;
        const duration = appointment.duration;

        const [hour, minute] = start.split(':').map(Number);
        const startMinutes = hour * 60 + minute;

        const slotCount = Math.ceil(duration / 10);

        for (let i = 0; i < slotCount; i++) {
            const current = startMinutes + i * 10;
            const h = String(Math.floor(current / 60)).padStart(2, '0');
            const m = String(current % 60).padStart(2, '0');
            bookedSlots.push(`${h}:${m}`);
        }
    }

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return availableSlots
};

module.exports = {
    availableSlotsService
};