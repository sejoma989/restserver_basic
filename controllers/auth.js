import { response } from 'express';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.js';
import { generarJWT } from '../helpers/generar-jwt.js';

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
        
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar si usuario esta activo en BD
        if ( !usuario.estado ){ //   if ( usuario.estado === false  )
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado : false'
            });
        }

        // Validar la contraseña
        const validPassword = bcrypt.compareSync( password.toString(), usuario.password );
        if ( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

export {
    login
}