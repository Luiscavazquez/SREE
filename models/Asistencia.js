const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
  IdAsistencia: {
    type: Number,
    required: true,
    unique: true
  },
  IdClase: {
    type: Number,
    required: true
  },
  Nombre: {
    type: String,
    required: true
  },
  ApellidoP: {
    type: String,
    required: true
  },
  ApellidoM: {
    type: String,
    required: true
  },
  NumeroControl: {
    type: Number,
    required: true
  },
  Estado: {
    type: String,
    default: null
  },
  Fecha: {
    type: Date,
    default: null
  },
  HoraEntrada: {
    type: String,
    default: null
  },
  HoraSalida: {
    type: String,
    default: null
  },
  Semestre: {
    type: Number,
    required: true
  },
  Materia: {
    type: String,
    default: null
  },
  Aula: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('AsistenciaAlumno', AsistenciaSchema, 'AsistenciaAlumno');

