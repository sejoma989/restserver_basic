import {response, request} from  'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario al que corresponde el uid de autenticacion
        const usuario = await Usuario.findById( uid );

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            })
        }

        // Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario autenticado estado : false'
            })
        }

        req.usuario = usuario;
        next();
        
    } catch (error) {
        
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        })
    }


}

export {
    validarJWT
}