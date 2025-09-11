const Service = require('../models/ServiceSchema');

const createService = async (req, res) => {
    try {
        const { name, price, duration, barbershopId } = req.body;
        const existingService = await Service.findOne({ name });
        if (existingService) return res.status(400).json({ message: 'Serviço ja cadastrado.' });
        const service = new Service({ name, price, duration, barbershop: barbershopId });
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar serviço.' });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado.' });

        await Service.findByIdAndDelete(id);
        res.status(200).json({ message: 'Serviço deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar serviço.' });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, duration } = req.body;

        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado.' });

        service.name = name || service.name;
        service.price = price || service.price;
        service.duration = duration || service.duration;

        await service.save();
        res.status(200).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar serviço.' });
    }
};

const getServicesByBarbershop = async (req, res) => {
    try {
        const { barbershopId } = req.params;

        const services = await Service.find({ barbershop: barbershopId });
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar serviços da barbearia.' });
    }
};

module.exports = {
    createService,
    deleteService,
    updateService,
    getServicesByBarbershop
};