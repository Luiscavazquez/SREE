const { pool } = require('../config/db');
const Clase = require('../models/Clase');

// Asignar alumno a clase y también agregarlo en MongoDB
const asignarAlumnoAClase = async (req, res) => {
  const { idAlumno, idClase } = req.body;

  try {
    const existe = await pool.query(
      'SELECT * FROM Alumno_Clase WHERE IdAlumno = $1 AND IdClase = $2',
      [idAlumno, idClase]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'El alumno ya está asignado a esta clase.' });
    }

    await pool.query(
      'INSERT INTO Alumno_Clase (IdAlumno, IdClase) VALUES ($1, $2)',
      [idAlumno, idClase]
    );

    const alumnoData = await pool.query(
      'SELECT Nombre, ApellidoPaterno, ApellidoMaterno FROM Alumnos WHERE IdAlumno = $1',
      [idAlumno]
    );

    if (alumnoData.rows.length === 0) {
      return res.status(404).json({ message: 'Alumno no encontrado.' });
    }

    const alumno = alumnoData.rows[0];
const nombreCompleto = `${alumno.nombre} ${alumno.apellidopaterno} ${alumno.apellidomaterno}`;


    const claseMongo = await Clase.findOne({ IdClase: idClase });
    if (!claseMongo) {
      return res.status(404).json({ message: 'Clase no encontrada en MongoDB.' });
    }
    // Validación defensiva por si IdMaestro desaparece
    if (!claseMongo.IdMaestro) {
    console.warn("Advertencia: IdMaestro estaba vacío en claseMongo. Rellenando con valor fijo.");
    claseMongo.IdMaestro = 1; // O consulta a PostgreSQL si deseas que sea dinámico
    }
    claseMongo.Alumnos.push({
      IdAlumno: idAlumno,
      Nombre: nombreCompleto
    });
    console.log("Antes de guardar Mongo:");
    console.log(JSON.stringify(claseMongo, null, 2));
    
    await claseMongo.save();

    res.status(201).json({ message: 'Alumno asignado correctamente a la clase (PostgreSQL + MongoDB).' });

  } catch (error) {
    console.error('Error asignando alumno a clase:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Seleccionar materia (alternativa con ON CONFLICT DO NOTHING)
const seleccionarMateria = async (req, res) => {
  const { idAlumno, idClase } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Alumno_Clase (IdAlumno, IdClase)
       VALUES ($1, $2)
       ON CONFLICT (IdAlumno, IdClase) DO NOTHING
       RETURNING *;`,
      [idAlumno, idClase]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ message: 'La materia ya fue seleccionada por este alumno' });
    }

    res.status(201).json({
      message: 'Materia seleccionada exitosamente',
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  asignarAlumnoAClase,
  seleccionarMateria
};
