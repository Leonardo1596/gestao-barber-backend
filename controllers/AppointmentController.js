const Appointment = require("../models/AppointmentSchema");
const Service = require("../models/ServiceSchema");
const Barbershop = require("../models/BarbershopSchema");
const Transaction = require("../models/TransactionSchema");
const { availableSlotsService } = require("../services/appointmentService");

const createAppointment = async (req, res) => {
	try {
		const {
			clientName,
			barbershop,
			barber,
			services,
			date,
			hour,
			paymentMethod,
		} = req.body;

		// Find barbershop by id
		const barbershopDoc = await Barbershop.findById(barbershop);
		if (!barbershopDoc)
			return res
				.status(404)
				.json({ message: "Barbearia nao encontrada." });

		// Find services by ids
		const serviceDocs = await Service.find({ _id: { $in: services } });

		// Calculate total duration
		const totalDuration = serviceDocs.reduce(
			(sum, service) => sum + service.duration,
			0
		);

		// // Get available slots
		const availableTimes = await availableSlotsService({
			date,
			barber,
			barbershop,
		});

		// Check if slot is valid
		function isValidSlot(hour, availableSlots) {
			return availableTimes.includes(hour);
		}
		if (!isValidSlot(hour, availableTimes)) {
			return res.status(400).json({
				message: "Horário inválido. Escolha um horário disponível.",
			});
		}

		const appointment = new Appointment({
			clientName,
			barbershop,
			barber,
			services,
			duration: totalDuration,
			date,
			hour,
			paymentMethod,
		});
		await appointment.save();

		res.status(201).json(appointment);
	} catch (err) {
		console.error(err);
		res.status(400).json({ message: "Erro ao criar agendamento" });
	}
};

const updateAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			clientName,
			barbershop,
			barber,
			services,
			date,
			hour,
			status,
			paymentMethod,
		} = req.body;

		const appointment = await Appointment.findById(id);
		if (!appointment)
			return res
				.status(404)
				.json({ message: "Agendamento nao encontrado." });

		// // Get available slots
		const availableTimes = await availableSlotsService({
			date,
			barber,
			barbershop,
		});

		// Check if slot is valid
		function isValidSlot(hour, availableSlots) {
			return availableTimes.includes(hour);
		}

		if (!isValidSlot(hour, availableTimes)) {
			return res.status(400).json({
				message: "Horário inválido. Escolha um horário disponível.",
			});
		}

		appointment.clientName = clientName || appointment.clientName;
		appointment.barbershop = barbershop || appointment.barbershop;
		appointment.barber = barber || appointment.barber;
		appointment.services = services || appointment.services;
		appointment.date = date || appointment.date;
		appointment.hour = hour || appointment.hour;
		appointment.paymentMethod = paymentMethod || appointment.paymentMethod;
		appointment.status = status || appointment.status;

		if (status === "concluido") {
			const servicesDocs = await Service.find({
				_id: { $in: services || appointment.services },
			});
			const totalAmount = servicesDocs.reduce(
				(sum, service) => sum + service.price,
				0
			);

			const newTransaction = new Transaction({
				type: "entrada",
				entryType: "agendamento",
				barbershop: appointment.barbershop,
				description: `Agendamento do cliente ${appointment.clientName} concluido com sucesso`,
				amount: totalAmount,
				date: appointment.date,
				appointment: id,
				barber: appointment.barber,
			});
			await newTransaction.save();
		}

		await appointment.save();
		res.status(200).json(appointment);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro ao atualizar agendamento" });
	}
};

const deleteAppointment = async (req, res) => {
	try {
		const { id } = req.params;

		const appointment = await Appointment.findById(id);
		if (!appointment)
			return res
				.status(404)
				.json({ message: "Agendamento nao encontrado." });

		await Appointment.findByIdAndDelete(id);
		res.status(200).json({ message: "Agendamento deletado com sucesso." });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro ao deletar agendamento" });
	}
};

const getAvailableTimes = async (req, res) => {
	try {
		const { date, barber, barbershop } = req.params;

		const availableTimes = await availableSlotsService({
			date,
			barber,
			barbershop,
		});
		return res.status(200).json(availableTimes);
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: "Erro ao buscar horários disponíveis",
		});
	}
};

const getAllAppointments = async (req, res) => {
	try {
		const appointments = await Appointment.find();
		res.status(200).json(appointments);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro ao buscar agendamentos" });
	}
};

const getAppointmentsByDate = async (req, res) => {
	const { startDate, endDate } = req.query;
	const { barbershop } = req.params;

	if (!startDate || !endDate) {
		return res
			.status(400)
			.json({ error: "Start date and end date are required" });
	}

	try {
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			return res.status(400).json({ error: "Invalid date format" });
		}

		const appointments = await Appointment.find({
			barbershop: barbershop,
			date: {
				$gte: start,
				$lte: end,
			},
		});

		res.status(200).json(appointments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Erro ao recuperar os agendamentos" });
	}
};

module.exports = {
	createAppointment,
	getAvailableTimes,
	updateAppointment,
	deleteAppointment,
	getAllAppointments,
	getAppointmentsByDate,
};
