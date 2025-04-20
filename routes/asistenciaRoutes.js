
const express = require('express');
const router = express.Router();
const AsistenciaController = require('../Controllers/AsistenciaController');

// Ruta de prueba
router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});
//RUTAS DE APIS NO BORRAR O EDITAR.
router.post('/asistencia', AsistenciaController.registrarAsistencia);
router.get('/:numeroControl', AsistenciaController.verAsistenciasPorNumeroControl);

module.exports = router;
