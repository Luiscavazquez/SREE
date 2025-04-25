const { pool } = require('../config/db');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');


const registrarUsuario = async (req, res) => {
    const {correo, contrasenia, tipoUsuario} = req.body;

    try{
        // Valida si el correo electronico existe

        const resultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (resultado.rows.length > 0) {
            return res.status(400).json({ mensaje: 'El correo ya esta registrado'});
        }

        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Guardar en PostgreSQL
        const nuevoUsuario = await pool.query(
            'INSERT INTO usuarios (correo, contrasenia, tipoUsuario, fechaRegistro) VALUES ($1, $2, $3, NOW()) RETURNING id',
            [correo, hashedPassword, tipoUsuario]
        );

        console.log('Insertando en MongoDB:', { correo, contrasenia: hashedPassword, tipoUsuario, fechaRegistro: new Date() });


        // Guardar en MongoDB + codigo para verificar guardado
        try {
            console.log("Intentando guardar en MongoDB...")
            await Usuario.create({
                correo,
                contrasenia: hashedPassword,
                tipoUsuario,
                fechaRegistro: new Date()
        });
        console.log("Usuario guardado en MongoDB.")
    } catch (mongoError) {
        console.error("Error al guardar en MongoDB: ", mongoError)
    }

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            id: nuevoUsuario.rows[0].id
        });
    } catch(error) {
        console.error('Error al registrar usuario: ', error);
        res.status(500).json({ mensaje: 'Error interno del servidor'});
    }
};

const loginUsuario = async(req, res) => {
const{correo, contrasenia} = req.body;

try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (resultado.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Correo no econtrado'});
    }

    const usuario = resultado.rows[0];
    const passwordMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if(!passwordMatch) {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta'});
    }

    res.status(200).json({ mensaje: 'Inicio de sesion exitoso', id: usuario.id});
} catch (error){
    console.error('Error al iniciar sesion: ', error);
    res.status(500).json({ mensaje: 'Error interno del servidor'});
}
};

module.exports = {
    registrarUsuario,
    loginUsuario
};