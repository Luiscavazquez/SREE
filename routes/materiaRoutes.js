const express = require('express');
const router = express.Router();
const MateriaController = require('../Controllers/MateriaController');

// Ruta para dar de alta una materia
router.post('/', MateriaController.crearMateria);

// Obtener todas las materias
router.get('/', MateriaController.obtenerMaterias);

// Buscar materia por Clave (debe ir antes que :id)
router.get('/clave/:clave', MateriaController.obtenerMateriaPorClave);

// Buscar materia por ID
router.get('/:id', MateriaController.obtenerMateriaPorId);

module.exports = router;