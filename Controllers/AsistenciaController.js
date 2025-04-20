const { pool } = require('../config/db');

exports.registrarAsistencia = async (req, res) => {
  try {
    const {
      Nombre,
      ApellidoP,
      ApellidoM,
      NumeroControl,
      Materia,
      Aula,
      Semestre
    } = req.body;

    const ahora = new Date();
    const horaActual = ahora.toTimeString().substring(0, 5);
    const fechaActual = ahora.toISOString().substring(0, 10);
    const diasEspañol = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaSemana = diasEspañol[ahora.getDay()];

    const claseQuery = `
      SELECT * FROM clase
      WHERE aula = $1 AND idmateria = (
        SELECT idmateria FROM materia WHERE nombre = $2
      )
    `;
    const claseResult = await pool.query(claseQuery, [Aula, Materia]);

    if (claseResult.rowCount === 0) {
      return res.status(404).json({ error: 'Clase no encontrada en PostgreSQL' });
    }

    const clase = claseResult.rows[0];

    const horarioQuery = `
      SELECT * FROM horario
      WHERE idclase = $1 AND LOWER(diasemana) = $2
    `;
    const horarioResult = await pool.query(horarioQuery, [clase.idclase, diaSemana]);

    if (horarioResult.rowCount === 0) {
      return res.status(404).json({ error: 'Horario no encontrado para hoy' });
    }

    const horario = horarioResult.rows[0];

    const [hInicio, mInicio] = horario.horainicio.split(':').map(Number);
    const [hActual, mActual] = horaActual.split(':').map(Number);
    const minutosInicio = hInicio * 60 + mInicio;
    const minutosAhora = hActual * 60 + mActual;

    let Estado = 'Falta';
    if (minutosAhora <= minutosInicio) Estado = 'Presente';
    else if (minutosAhora <= minutosInicio + 15) Estado = 'Retardo';

    const insertQuery = `
      INSERT INTO asistencias (
        idclase, nombre, apellidop, apellidom,
        numerocontrol, semestre, horaentrada, horasalida,
        fecha, estado, materia, aula
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `;

    const values = [
      clase.idclase,
      Nombre,
      ApellidoP,
      ApellidoM,
      NumeroControl,
      Semestre,
      horaActual,
      horario.horafin,
      fechaActual,
      Estado,
      Materia,
      Aula
    ];

    const insertResult = await pool.query(insertQuery, values);
    const MongoAsistencia = require('../models/Asistencia');
    const nuevaAsistencia = insertResult.rows[0];

    const mongoAsistencia = new MongoAsistencia({
      IdAsistencia: nuevaAsistencia.idasistencia,
      IdClase: nuevaAsistencia.idclase,
      Nombre: nuevaAsistencia.nombre,
      ApellidoP: nuevaAsistencia.apellidop,
      ApellidoM: nuevaAsistencia.apellidom,
      NumeroControl: nuevaAsistencia.numerocontrol,
      Semestre: nuevaAsistencia.semestre,
      HoraEntrada: nuevaAsistencia.horaentrada,
      HoraSalida: nuevaAsistencia.horasalida,
      Fecha: nuevaAsistencia.fecha,
      Estado: nuevaAsistencia.estado,
      Materia: nuevaAsistencia.materia,
      Aula: nuevaAsistencia.aula
    });

    await mongoAsistencia.save();

    res.status(201).json({
      message: 'Asistencia registrada correctamente',
      asistencia: nuevaAsistencia
    });

  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({
      error: 'Error interno al registrar asistencia',
      details: error.message
    });
  }
};

//ver asistencias por número de control
exports.verAsistenciasPorNumeroControl = async (req, res) => {
  const numeroControl = req.params.numeroControl;

  try {
    const resultado = await pool.query(
      'SELECT * FROM asistencias WHERE numerocontrol = $1',
      [numeroControl]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron asistencias para este número de control.' });
    }

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
