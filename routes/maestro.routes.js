const express = require('express');

const router = express.Router();

const maestroController = require('../controllers/maestroController');

// Registrar maestro de forma manual
router.post('/registro-maestro', maestroController.registrarMaestro);

module.exports = router;