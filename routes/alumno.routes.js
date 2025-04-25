const express = require('express');
const router = express.Router();

const alumnoExtraController = require('../controllers/alumnoExtraController');

// Registrar alumno manualmente
router.post('/registro-alumno', alumnoExtraController.registrarAlumno);

module.exports =router;