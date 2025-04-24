const express = require('express');
const router = express.Router();

const alumnoController = require('../controllers/alumnoExtraController');

// Registrar alumno manualmente
router.post('/registro-alumno', alumnoExtraController.registrarAlumno);

module.exports =router;