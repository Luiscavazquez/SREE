const express = require('express');
const router = express.Router();
const { asignarAlumnoAClase, seleccionarMateria } = require('../Controllers/AlumnoController');

router.post('/asignar-a-clase', asignarAlumnoAClase);
router.post('/seleccionar-materia', seleccionarMateria);

module.exports = router;
