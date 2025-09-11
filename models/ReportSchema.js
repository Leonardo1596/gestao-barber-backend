const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["weekly", "monthly", "yearly"],
    required: true,
  },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  barbershop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barbershop",
    required: true,
  },
  revenues: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  netRevenue: { type: Number, default: 0 },
  profitMargin: { type: Number, default: 0 },
  appointmentRevenues: { type: Number, default: 0 },
  productRevenues: { type: Number, default: 0 },
  productsSold: { type: Number, default: 0 },
  completedAppointments: { type: Number, default: 0 },
  completedServices: { type: Number, default: 0 },
  averageTicketAppointment: { type: Number, default: 0 },
  averageTicketService: { type: Number, default: 0 },
  growth: {
    revenueGrowth: { type: Number, default: 0 },
    profitGrowth: { type: Number, default: 0 },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", ReportSchema);