const mongoose = require('mongoose');

const AlumnoSchema = new mongoose.Schema({
    idUsuario: {type: Number, required: true},
    nombre: {type: String, required: true},
    apellidoPaterno: {type: String, required: true},
    apellidoMaterno: {type: String, required: true},
    numeroControl: {type: String, required: true, unique: true},
    semestre: {type: Number, required: true}
    }, {
        collection: 'alumnos'
});

module.exports = mongoose.model('Alumno', AlumnoSchema);