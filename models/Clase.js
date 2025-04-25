const mongoose = require('mongoose');

const ClaseSchema = new mongoose.Schema({
  IdClase: {
    type: Number,
    required: true,
    unique: true
  },
  Aula: {
    type: String,
    required: true
  },
  IdMateria: {
    type: Number,
    required: true
  },
  IdMaestro: {
    type: Number,
    required: true
  },
  Alumnos: [
    {
      IdAlumno: { type: Number, required: true },
      Nombre: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Clase', ClaseSchema);
