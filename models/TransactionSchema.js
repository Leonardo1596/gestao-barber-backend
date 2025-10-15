const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
	{
		barbershop: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Barbershop",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		type: {
			type: String,
			enum: ["entrada", "saida"],
			required: true,
		},
		entryType: {
			type: String,
			enum: ["agendamento", "produto-vendido"],
			required: function () {
				return this.type === "entrada";
			},
		},
		amount: {
			type: Number,
			min: 0,
			required: function () {
				return (
					this.type === "saida" ||
					(this.type === "entrada" &&
						this.entryType === "agendamento")
				);
			},
		},
		clientName: {
			type: String,
			trim: true,
			required: function () {
				return (
					this.type === "entrada" && this.entryType === "agendamento"
				);
			},
		},
		description: {
			type: String,
			trim: true,
			default: "",
		},
		date: {
			type: Date,
			required: true,
		},
		appointment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Appointment",
			required: function () {
				return (
					this.type === "entrada" && this.entryType === "agendamento"
				);
			},
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: function () {
				return (
					this.type === "entrada" &&
					this.entryType === "produto-vendido"
				);
			},
		},
		quantity: {
			type: Number,
			required: function () {
				return (
					this.type === "entrada" &&
					this.entryType === "produto-vendido"
				);
			},
		},
		barber: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Barber",
			required: function () {
				return (
					(this.type === "entrada" &&
						this.entryType === "produto-vendido") ||
					(this.type === "entrada" &&
						this.entryType === "agendamento")
				);
			},
		},
		status: {
			type: String,
			enum: ["pendente", "pago"],
			default: "pago",
		},
	},
	{
		timestamps: true,
		collection: "transactions",
	}
);

module.exports = mongoose.model("Transaction", TransactionSchema);
