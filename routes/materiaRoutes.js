const express = require('express');
const router = express.Router();
const MateriaController = require('../Controllers/MateriaController');

// Ruta para dar de alta una materia
router.post('/', MateriaController.crearMateria);

module.exports = router;
