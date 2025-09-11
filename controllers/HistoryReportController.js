// controllers/HistoryReportController.js
const Report = require('../models/ReportSchema');
const Transaction = require('../models/TransactionSchema');
const Appointment = require('../models/AppointmentSchema');

const generateReportJob = async ({ type, barbershop, startDate, endDate }) => {
    const transactions = await Transaction.find({ barbershop, date: { $gte: startDate, $lte: endDate } });

    const revenues = transactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);

    const netRevenue = revenues - expenses;
    const profitMargin = revenues > 0 ? (netRevenue / revenues) * 100 : 0;

    const appointmentRevenues = transactions.filter(t => t.entryType === 'agendamento').reduce((acc, t) => acc + t.amount, 0);
    const productRevenues = transactions.filter(t => t.entryType === 'produto-vendido').reduce((acc, t) => acc + t.amount, 0);
    const productsSold = transactions.filter(t => t.entryType === 'produto-vendido').reduce((acc, t) => acc + t.quantity, 0);

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

    const start = new Date(startDate);
    const previousReport = await Report.findOne({
        type,
        'period.startDate': { $lt: start },
        barbershop
    }).sort({ 'period.startDate': -1 });

    let revenueGrowth = 0;
    let profitGrowth = 0;

    if (previousReport) {
        if (previousReport.revenues !== 0) {
            revenueGrowth = ((revenues - previousReport.revenues) / previousReport.revenues) * 100;
            profitGrowth = ((netRevenue - previousReport.netRevenue) / previousReport.netRevenue) * 100;
        } else {
            revenueGrowth = revenues > 0 ? 100 : 0;
            profitGrowth = netRevenue > 0 ? 100 : 0;
        }
    }

    const report = await Report.create({
        type,
        period: { startDate, endDate },
        barbershop,
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
        averageTicketService,
        growth: { revenueGrowth, profitGrowth }
    });

    return report;
};

const generateReport = async (req, res) => {
    try {
        const { type, barbershop, startDate, endDate } = req.body;
        const report = await generateReportJob({ type, barbershop, startDate, endDate });
        res.status(200).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
};

module.exports = { generateReport, generateReportJob };
