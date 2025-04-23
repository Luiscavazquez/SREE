const express = require('express');
const router = express.Router();
const { asignarAlumnoAClase } = require('../Controllers/AlumnoController');

router.post('/asignar-a-clase', asignarAlumnoAClase);

module.exports = router;
