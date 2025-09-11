const Product = require('../models/ProductSchema');

const createProcuct = async (req, res) => {
    try {
        const { name, price, quantity, description, barbershop } = req.body;
        const product = new Product({ name, price, quantity, description, barbershop });
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar produto' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: 'Produto nao encontrado.' });
        res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao deletar produto' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, description } = req.body;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Produto nao encontrado.' });
        product.name = name || product.name;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;
        product.description = description || product.description;
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
};


const getProductByBarbershop = async (req, res) => {
    try {
        const { barbershop } = req.params;
        const products = await Product.find({ barbershop });
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
};

module.exports = {
    createProcuct,
    deleteProduct,
    updateProduct,
    getProductByBarbershop
};