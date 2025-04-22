const Clase = require('../models/Clase');

// Crear una nueva clase
const crearClase = async (req, res) => {
  try {
    const { IdClase, Aula, IdMateria, Materia } = req.body;

    if (!IdClase || !Aula || !IdMateria || !Materia) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios.' });
    }

    const claseExistente = await Clase.findOne({ IdClase });
    if (claseExistente) {
      return res.status(409).json({ mensaje: 'El IdClase ya está registrado.' });
    }

    const nuevaClase = new Clase({ IdClase, Aula, IdMateria, Materia });
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
