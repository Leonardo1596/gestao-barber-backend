const Transction = require("../models/TransactionSchema");
const Product = require("../models/ProductSchema");

const createTransaction = async (req, res) => {
	try {
		const {
			type,
			entryType,
			barbershop,
			description,
			date,
			appointment,
			product,
			quantity,
			barber,
		} = req.body;
		let amount = req.body.amount;

		if (entryType === "produto-vendido") {
			const productDoc = await Product.findById(product);
			if (!productDoc)
				return res
					.status(404)
					.json({ message: "Produto nao encontrado." });
			if (productDoc.quantity < quantity)
				return res
					.status(400)
					.json({ message: "Quantidade de produtos insuficiente." });
			productDoc.quantity -= quantity;
			await productDoc.save();
			amount = productDoc.price * quantity;
		}

		const transaction = new Transction({
			type,
			entryType,
			barbershop,
			amount,
			description,
			date,
			appointment,
			product,
			quantity,
			barber,
		});
		await transaction.save();
		res.status(200).json(transaction);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro ao criar transação" });
	}
};

const deleteTransaction = async (req, res) => {
	try {
		const { id } = req.params;
		const transaction = await Transction.findByIdAndDelete(id);
		if (!transaction)
			return res
				.status(404)
				.json({ message: "Transação nao encontrada." });
		res.status(200).json({ message: "Transação deletada com sucesso." });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro ao deletar transação" });
	}
};

const getTransactionsByBarbershop = async (req, res) => {
	try {
		const { barbershop } = req.params;
		const transactions = await Transction.find({ barbershop });
		res.status(200).json(transactions);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro ao buscar transações" });
	}
};

const getTransactionByPeriod = async (req, res) => {
	try {
		const { barbershop, startDate, endDate } = req.params;
		const transactions = await Transction.find({
			barbershop,
			date: { $gte: startDate, $lte: endDate },
		});
		res.status(200).json(transactions);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro ao buscar transações" });
	}
};

module.exports = {
	createTransaction,
	deleteTransaction,
	getTransactionsByBarbershop,
	getTransactionByPeriod,
};
