const Transaction = require('../models/TransactionSchema');
const Appointment = require('../models/AppointmentSchema');

const getReportByPeriod = async (req, res) => {
    try {
        const { barbershop, startDate, endDate } = req.params;
        const transactions = await Transaction.find({ barbershop, date: { $gte: startDate, $lte: endDate } });
        const revenues = transactions.filter(transaction => transaction.type === 'entrada').reduce((acc, transaction) => acc + transaction.amount, 0);
        const expenses = transactions.filter(transaction => transaction.type === 'saida').reduce((acc, transaction) => acc + transaction.amount, 0);
        const netRevenue = revenues - expenses;
        const profitMargin = revenues > 0 ? (netRevenue / revenues) * 100 : 0;
        const appointmentRevenues = transactions.filter(transaction => transaction.entryType === 'agendamento').reduce((acc, transaction) => acc + transaction.amount, 0);
        const productRevenues = transactions.filter(transaction => transaction.entryType === 'produto-vendido').reduce((acc, transaction) => acc + transaction.amount, 0);
        const productsSold = transactions.filter(transaction => transaction.entryType === 'produto-vendido').reduce((acc, transaction) => acc + transaction.quantity, 0);

        const completedAppointments = await Appointment.find({
            barbershop,
            status: 'concluido',
            date: { $gte: startDate, $lte: endDate }
        });
        const totalServices = completedAppointments.reduce((sum, appt) => sum + appt.services.length, 0);
        const averageTicketAppointment = completedAppointments.length > 0
            ? appointmentRevenues / completedAppointments.length
            : 0;

        const averageTicketService = totalServices > 0
            ? appointmentRevenues / totalServices
            : 0;

        res.status(200).json({
            revenues,
            expenses,
            netRevenue,
            profitMargin,
            appointmentRevenues,
            productRevenues,
            productsSold,
            completedAppointments: completedAppointments.length,
            completedServices: totalServices,
            averageTicketAppointment,
            averageTicketService
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter relatório' });
    }
};

const getReportByBarberAndPeriod = async (req, res) => {
    try {
        const { barbershop, barber, startDate, endDate } = req.params;
        const transactions = await Transaction.find({ barbershop, barber, date: { $gte: startDate, $lte: endDate } });
        const revenues = transactions.filter(transaction => transaction.type === 'entrada').reduce((acc, transaction) => acc + transaction.amount, 0);
        const expenses = transactions.filter(transaction => transaction.type === 'saida').reduce((acc, transaction) => acc + transaction.amount, 0);
        const netRevenue = revenues - expenses;
        const profitMargin = (netRevenue / revenues) * 100;
        const appointmentRevenues = transactions.filter(transaction => transaction.entryType === 'agendamento').reduce((acc, transaction) => acc + transaction.amount, 0);
        const productRevenues = transactions.filter(transaction => transaction.entryType === 'produto-vendido').reduce((acc, transaction) => acc + transaction.amount, 0);
        const productsSold = transactions.filter(transaction => transaction.entryType === 'produto-vendido').reduce((acc, transaction) => acc + transaction.quantity, 0);

        const completedAppointments = await Appointment.find({
            barbershop,
            barber,
            status: 'concluido',
            date: { $gte: startDate, $lte: endDate }
        });
        const totalServices = completedAppointments.reduce((sum, appt) => sum + appt.services.length, 0);
        const averageTicketAppointment = appointmentRevenues / completedAppointments.length;
        const averageTicketService = appointmentRevenues / totalServices;

        res.status(200).json({
            revenues,
            expenses,
            netRevenue,
            profitMargin,
            appointmentRevenues,
            productRevenues,
            productsSold,
            completedAppointments: completedAppointments.length,
            completedServices: totalServices,
            averageTicketAppointment,
            averageTicketService
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter relatório' });
    }
}

module.exports = {
    getReportByPeriod,
    getReportByBarberAndPeriod
}