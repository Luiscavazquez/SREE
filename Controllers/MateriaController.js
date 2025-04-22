const { pool } = require('../config/db');
const Materia = require('../models/Materia');

exports.crearMateria = async (req, res) => {
  try {
    const { Nombre, Clave, Creditos } = req.body;

    if (!Nombre || !Clave || !Creditos) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si la clave ya existe
    const checkQuery = 'SELECT * FROM materia WHERE clave = $1';
    const checkResult = await pool.query(checkQuery, [Clave]);

    if (checkResult.rowCount > 0) {
      return res.status(409).json({ error: 'Ya existe una materia con esa clave' });
    }

    // Insertar en PostgreSQL
    const insertQuery = `
      INSERT INTO materia (nombre, clave, creditos)
      VALUES ($1, $2, $3)
      RETURNING idmateria
    `;
    const result = await pool.query(insertQuery, [Nombre, Clave, Creditos]);
    const idGenerado = result.rows[0].idmateria;

    // Insertar en MongoDB
    const nuevaMateriaMongo = new Materia({
      IdMateria: idGenerado,
      Nombre,
      Clave,
      Creditos
    });

    await nuevaMateriaMongo.save();

    res.status(201).json({
      mensaje: 'Materia registrada en PostgreSQL y MongoDB',
      IdMateria: idGenerado
    });

  } catch (error) {
    console.error('Error al registrar materia:', error);
    res.status(500).json({ error: 'Error interno al registrar materia' });
  }
};

exports.obtenerMaterias = async (req, res) => {
  try {
    // Obtener todas las materias desde MongoDB
    const materias = await Materia.find();

    res.status(200).json(materias);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    res.status(500).json({ error: 'Error interno al obtener materias' });
  }
};
