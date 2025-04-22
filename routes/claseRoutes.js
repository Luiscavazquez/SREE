const express = require('express');
const router = express.Router();
const { crearClase, agregarAlumnosAClase } = require('../Controllers/claseController');

// Ruta para crear una clase
router.post('/', crearClase);

// Ruta para agregar alumnos a una clase específica
router.post('/:idClase/alumnos', agregarAlumnosAClase);

module.exports = router;

