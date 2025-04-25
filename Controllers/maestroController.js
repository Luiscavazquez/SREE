const { pool } = require('../config/db');
const Maestro = require('../models/maestro.model');

const registrarMaestro = async (req, res) => {
  try {
    const nuevoMaestro = req.body;

    const existe = await pool.query(
      'SELECT * FROM maestros WHERE claveempleado = $1',
      [nuevoMaestro.claveempleado]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un maestro con esa clave de empleado.' });
    }

    const result = await pool.query(
      'INSERT INTO maestros (idusuario, nombre, apellidopaterno, apellidomaterno, claveempleado, especialidad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        nuevoMaestro.idUsuario,
        nuevoMaestro.nombre,
        nuevoMaestro.apellidoPaterno,
        nuevoMaestro.apellidoMaterno,
        nuevoMaestro.claveEmpleado,
        nuevoMaestro.especialidad
      ]
    );

    // Inserta también en MongoDB
    await Maestro.create({
      idUsuario: nuevoMaestro.idUsuario,
      nombre: nuevoMaestro.nombre,
      apellidoPaterno: nuevoMaestro.apellidoPaterno,
      apellidoMaterno: nuevoMaestro.apellidoMaterno,
      claveEmpleado: nuevoMaestro.claveEmpleado,
      especialidad: nuevoMaestro.especialidad
    }); 

    res.status(200).json({ mensaje: 'Maestro registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar maestro:', error);
    res.status(500).json({ error: 'Error al registrar maestro' });
  }
};

module.exports = { registrarMaestro };
