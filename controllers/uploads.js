import { response } from "express";
import fs from "fs";
import path from "path";

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: "ddcp4wxei",
    api_key: "555242196676733",
    api_secret: "i6ow4-dbi4RV4b6i0JvTYxVZ78E"        
});

import { subirArchivo } from "../helpers/index.js";
import { Producto, Usuario } from "../models/index.js";

const cargarArchivo = async (req, res = response) => {
    
    // validacion archivo subir reemplazada por middleware
    try {

        // llamado a helper con extensiones personalizadas
        // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({ nombre });

    } catch (msg) {

        res.status(400).json({ msg });

    }

}

const actualizarImagen = async (req, res = response) => {

    // validacion archivo subir reemplazada por middleware
    try {
        const { id, coleccion } = req.params;

        let modelo;
    
        switch (coleccion) {
    
            case 'usuarios':
    
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }
    
                break;
    
            case 'productos':
    
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }
    
                break;
    
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esta' });
        }
    
        // limpiar imagenes previas
        if ( modelo.img ) {
            // borrado de img en servidor fisico
            const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if ( fs.existsSync(pathImage) ) {
                fs.unlinkSync(pathImage)        
           }
        }
    
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
    
        await modelo.save();
    
        res.json({ modelo });
        
    } catch (msg) {
        res.status(400).json({ msg });
    }

}

const actualizarImagenCloudinary = async (req, res = response) => {

    // validacion archivo subir reemplazada por middleware
    try {
        const { id, coleccion } = req.params;

        let modelo;
    
        switch (coleccion) {
    
            case 'usuarios':
    
                modelo = await Usuario.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    });
                }
    
                break;
    
            case 'productos':
    
                modelo = await Producto.findById(id);
                if (!modelo) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    });
                }
    
                break;
    
            default:
                return res.status(500).json({ msg: 'Se me olvido validar esta' });
        }
    
        // limpiar imagenes previas
        if ( modelo.img ) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

        }

        const {tempFilePath} = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    
        modelo.img = secure_url;
    
        await modelo.save();
    
        res.json({ modelo });
        
    } catch (msg) {
        res.status(400).json({ msg });
    }

}

const mostrarImagen = async (req, res=response) => {

    const {id, coleccion} = req.params;

    let modelo;
    
    switch (coleccion) {

        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esta' });
    }

    // limpiar imagenes previas
    if ( modelo.img ) {
        // borrado de img en servidor fisico
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if ( fs.existsSync(pathImage) ) {
            return res.sendFile(pathImage);
       }
    }


    // reemplazo de placeholder
    const pathImage = path.join( __dirname, '../assets/no-image.jpg' )
    return res.sendFile( pathImage );

    // res.json({ 
    //     msg: 'Falta el placeholder',
    //  });

}

export {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}