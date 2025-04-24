const express = require('express');

const router = express.Router();

const authContoller = require('../controllers/authController');


// Registro
router.post('/registro', authContoller.registrarUsuario);

// Login
router.post('/login', authContoller.loginUsuario);

module.exports = router;