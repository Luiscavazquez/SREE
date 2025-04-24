const mongoose = require('mongoose');

const MaestrosSchema = new mongoose.Schema({
    idUsuario: {type: Number, required: true},
    nombre: {type: String, required: true},
    apellidoPaterno: {type: String, required: true},
    apellidoMaterno: {type: String, required: true},
    claveEmpleado: {type: String, required: true, unique: true},
    especialidad: {type: String, required: true}
    }, {
        collection: 'maestros'
});

module.exports = mongoose.model('Maestro', MaestrosSchema);