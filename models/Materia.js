const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
  IdMateria: {
    type: Number,
    required: true,
    unique: true
  },
  Nombre: {
    type: String,
    required: true
  },
  Clave: {
    type: String,
    required: true
  },
  Creditos: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Materia', MateriaSchema);

