const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
  IdHorario: {
    type: Number,
    required: true,
    unique: true
  },
  IdClase: {
    type: Number,
    required: true
  },
  Clase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clase',
    required: true
  },
  Dia: {
    type: String,
    required: true
  },
  HoraInicio: {
    type: String,
    required: true
  },
  HoraFin: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Horario', HorarioSchema);

