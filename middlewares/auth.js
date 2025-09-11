const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_KEY

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado: apenas admin pode realizar essa ação.' });
  }
  next();
}

module.exports = { authenticate, authorizeAdmin };