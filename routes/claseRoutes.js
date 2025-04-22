const express = require('express');
const router = express.Router();
const { crearClase } = require('../Controllers/claseController');

router.post('/', crearClase);

module.exports = router;

const { crearClase, agregarAlumnosAClase } = require('../Controllers/claseController');

router.post('/', crearClase);
router.post('/:idClase/alumnos', agregarAlumnosAClase);
