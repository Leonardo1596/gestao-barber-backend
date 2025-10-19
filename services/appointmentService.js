const mongoose = require("mongoose");
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
	// Buscar barbearia
	const barbershopDoc = await Barbershop.findById(barbershop);
	if (!barbershopDoc) throw new Error("Barbearia não encontrada");

	// Todos os horários possíveis
	const allSlots = getAvailableSlots(
		barbershopDoc.openingTime,
		barbershopDoc.closingTime,
		barbershopDoc.lunchBreak.start,
		barbershopDoc.lunchBreak.end
	);

	// Montar query para agendamentos
	const query = { barber, date }; // date ainda filtramos
	if (excludeId) {
		query._id = { $ne: excludeId }; // só aplica se houver excludeId
	}

	const appointments = await Appointment.find(query);

	const bookedSlots = [];

	appointments.forEach(({ hour, duration }) => {
		const [h, m] = hour.split(":").map(Number);
		let startMinutes = h * 60 + m;

		// aplica buffer antes do horário
		startMinutes = Math.max(0, startMinutes - bufferMinutes);

		const totalSlots = Math.ceil((duration + bufferMinutes) / 10);

		for (let i = 0; i < totalSlots; i++) {
			const current = startMinutes + i * 10;
			const hh = String(Math.floor(current / 60)).padStart(2, "0");
			const mm = String(current % 60).padStart(2, "0");
			bookedSlots.push(`${hh}:${mm}`);
		}
	});

	// Filtrar horários livres
	return allSlots.filter((slot) => !bookedSlots.includes(slot));
};

module.exports = { availableSlotsService };
