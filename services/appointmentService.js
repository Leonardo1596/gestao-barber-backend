const Appointment = require("../models/AppointmentSchema");
const Barbershop = require("../models/BarbershopSchema");
const { getAvailableSlots } = require("../utils/getAvailableSlots");

const availableSlotsService = async ({
	date,
	barber,
	barbershop,
	excludeId,
	bufferMinutes = 40,
}) => {
	// Search barbershop
	const barbershopDoc = await Barbershop.findById(barbershop);
	if (!barbershopDoc) throw new Error("Barbearia não encontrada");

	// Generates all possible slots based on opening and closing hours
	const allSlots = getAvailableSlots(
		barbershopDoc.openingTime,
		barbershopDoc.closingTime,
		barbershopDoc.lunchBreak.start,
		barbershopDoc.lunchBreak.end
	);

	// Mount query to exclude the edited appointment
	const query = { date, barber };
	if (excludeId) {
		query._id = { $ne: excludeId }; // Delete the current appointment from the query
	}

	// Search existent appointments
	const appointments = await Appointment.find(query);

	const bookedSlots = [];

	for (const appointment of appointments) {
		const start = appointment.hour; // Ex: "09:00"
		const duration = appointment.duration; // Ex: 30 minutos

		const [hour, minute] = start.split(":").map(Number);
		const startMinutes = hour * 60 + minute;

		const startWithBuffer = startMinutes - bufferMinutes;

		const totalDuration = duration + bufferMinutes;
		const slotCount = Math.ceil(totalDuration / 10);

		for (let i = 0; i < slotCount; i++) {
			const current = startWithBuffer + i * 10;
			if (current < 0) continue;

			const h = String(Math.floor(current / 60)).padStart(2, "0");
			const m = String(current % 60).padStart(2, "0");
			bookedSlots.push(`${h}:${m}`);
		}
	}

	const availableSlots = allSlots.filter(
		(slot) => !bookedSlots.includes(slot)
	);

	return availableSlots;
};

module.exports = {
	availableSlotsService,
};
