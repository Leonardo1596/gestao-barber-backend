const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const createAdmin = require('../middlewares/createAdmin');
const auth = require('../middlewares/auth');

router.post('/register', createAdmin, auth.authenticate, auth.authorizeAdmin, UserController.register);
router.post('/login', UserController.login);

module.exports = router;