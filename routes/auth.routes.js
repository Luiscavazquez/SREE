const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Registro
router.post('/registrar', authController.registrarUsuario);

// Login
router.post('/login', authController.loginUsuario);

module.exports = router;