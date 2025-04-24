const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    correo: {type: String, required: true},
    contrasenia: {type: String, required: true},
    tipoUsuario: {type: String, required: true},
    fechaRegistro: {type: Date, default: Date.now}
}, {
    collection: 'usuarios'
});

module.exports = mongoose.model('Usuario', UsuarioSchema);