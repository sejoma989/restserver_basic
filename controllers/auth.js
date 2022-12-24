import { response } from 'express';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario.js';
import { generarJWT } from '../helpers/generar-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';

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

const googleSignIn = async(req, res = response ) => {

    const { id_token } = req.body;


    try {

        const { correo, nombre, img } = await googleVerify( id_token );
        // console.log(googleUser)
        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            const data = {
                nombre, 
                correo, 
                password: ':p',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save()
        }

        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            });
        }

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        }); 

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

    

}

export {
    login,
    googleSignIn
}