const Barber = require('../models/BarberSchema');

const createBarber = async (req, res) => {
    try {
        const { name, barbershop } = req.body;

        const barber = new Barber({
            name,
            barbershop
        });
        await barber.save();
        res.status(201).json(barber);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Erro ao criar barbeiro' });
    }
};

const deleteBarber = async (req, res) => {
    try {
        const { id } = req.params;

        const barber = await Barber.findById(id);
        if (!barber) return res.status(404).json({ message: 'Barbeiro nao encontrado.' });

        await Barber.findByIdAndDelete(id);
        res.status(200).json({ message: 'Barbeiro deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao deletar barbeiro.' });
    }
};

const updateBarber = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, barbershop } = req.body;

        const barber = await Barber.findById(id);
        if (!barber) return res.status(404).json({ message: 'Barbeiro nao encontrado.' });

        barber.name = name || barber.name;
        barber.barbershop = barbershop || barber.barbershop;

        await barber.save();
        res.status(200).json(barber);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar barbeiro.' });
    }
};

const getBarbersByBarbershop = async (req, res) => {
    try {
        const { barbershopId } = req.params;

        const barbers = await Barber.find({ barbershop: barbershopId });
        res.status(200).json(barbers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar barbeiros da barbearia.' });
    }
};

module.exports = {
    createBarber,
    deleteBarber,
    updateBarber,
    getBarbersByBarbershop
};