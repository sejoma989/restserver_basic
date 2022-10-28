import {request, response} from "express";
import Usuario from "../models/usuario.js";
import bcrypt from 'bcrypt';



const usuariosGet = async(req = request, res = response) => {

    // const {q, nombre='No name', apikey, page = 1, limit =10} = req.query;
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query)

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}


const usuariosPost = async(req, res = response) => {

    // const body = req.body;
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    // verificar si el correo existe

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync( password.toString(), salt );


    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}


const ususariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: validar contra base de datos
    if( password ) {
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync( password.toString(), salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
}


const usuariosPatch = (req, res = response) => {
    res.json({
        // "ok":true,
        msg: "patch API - desde el controlador"
    })
}


const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrado por referencia
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json({
        usuario
    })
}


export {
    usuariosGet,
    usuariosPost,
    ususariosPut,
    usuariosPatch,
    usuariosDelete
}