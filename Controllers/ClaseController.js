const Clase = require('../models/Clase');
const { pool } = require('../config/db'); // conexión PostgreSQL

// Crear una nueva clase
const crearClase = async (req, res) => {
  try {
    const { Aula, IdMateria, IdMaestro } = req.body;

    if (!Aula || !IdMateria || !IdMaestro) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    // Guardar en PostgreSQL (IdClase se autogenera)
    const resultado = await pool.query(
      'INSERT INTO Clase (Aula, IdMateria, IdMaestro) VALUES ($1, $2, $3) RETURNING IdClase',
      [Aula, IdMateria, IdMaestro]
    );

    const nuevoIdClase = resultado.rows[0].idclase;

    // Guardar en MongoDB con el mismo IdClase
    const nuevaClase = new Clase({
      IdClase: nuevoIdClase,
      Aula,
      IdMateria,
      IdMaestro
    });

    await nuevaClase.save();

    res.status(201).json({ mensaje: 'Clase registrada exitosamente', clase: nuevaClase });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar la clase.' });
  }
};

// Agregar alumnos a una clase
const agregarAlumnosAClase = async (req, res) => {
  try {
    const { idClase } = req.params;
    const { alumnos } = req.body;

    if (!Array.isArray(alumnos) || alumnos.length === 0) {
      return res.status(400).json({ mensaje: 'Debe enviar un arreglo de alumnos.' });
    }

    const clase = await Clase.findOne({ IdClase: idClase });
    if (!clase) {
      return res.status(404).json({ mensaje: 'Clase no encontrada.' });
    }

    clase.Alumnos = [...(clase.Alumnos || []), ...alumnos];
    await clase.save();

    res.status(200).json({ mensaje: 'Alumnos agregados correctamente.', clase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar alumnos a la clase.' });
  }
};

module.exports = {
  crearClase,
  agregarAlumnosAClase
};
