const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const Barbershop = require("../models/BarbershopSchema");
const JWT_SECRET = process.env.JWT_KEY;

const register = async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			role,
			barbershopName,
			openingTime,
			closingTime,
			lunchBreak,
		} = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		if (role === "gerente" && req.user?.role !== "admin") {
			return res
				.status(403)
				.json({ message: "Apenas admin pode criar gerentes." });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(400).json({ message: "Usuário já existe." });

		const user = new User({
			name,
			email,
			password: hashedPassword,
			role,
		});

		if (role === "gerente") {
			const existingBarbershop = await Barbershop.findOne({
				user: user._id,
			});
			if (existingBarbershop)
				return res
					.status(400)
					.json({ message: "Usuário ja possui uma barbearia." });
			const barbershop = await Barbershop.create({
				name: barbershopName || `${name} Barbearia`,
				user: user._id,
				openingTime,
				closingTime,
				lunchBreak,
			});
			await barbershop.save();
			user.barbershop = barbershop._id;
		}
		await user.save();
		res.status(201).json({ message: "Usuário criado com sucesso." });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Erro ao criar usuário.",
			error: err.message,
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		console.log(user);
		if (!user) {
			console.log("caiu aqui");
			return;
		} else {
			const existingBarbershop = await Barbershop.findOne({
				user: user._id,
			});
			if (!user) {
				return res
					.status(400)
					.json({ message: "Credenciais inválidas." });
			}

			console.log("Usuário: " + user.name + " entrou");
			const valid = await bcrypt.compare(password, user.password);
			if (!valid)
				return res
					.status(400)
					.json({ message: "Credenciais inválidas." });

			const token = jwt.sign(
				{ id: user._id, role: user.role },
				JWT_SECRET,
				{
					expiresIn: "1d",
				}
			);

			res.json({
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					barbershop: existingBarbershop._id,
				},
				message: "Logado com sucesso",
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erro no login.", error: err.message });
	}
};

module.exports = {
	register,
	login,
};
