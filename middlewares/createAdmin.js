const bcrypt = require('bcryptjs');
const User = require('../models/UserSchema');

const createAdmin = async (req, res, next) => {
    const hashedPassword = await bcrypt.hash("123", 10);

    const hasAnyUser = await User.exists({});
    if (!hasAnyUser) {
        const user = new User({
            name: "admin",
            email: "admin@email.com",
            password: hashedPassword,
            role: 'admin'
        })

        await user.save();
        res.status(201).json({ message: 'Usuário Admin criado com sucesso.' });
        return;
    }
    next();
}

module.exports = createAdmin;