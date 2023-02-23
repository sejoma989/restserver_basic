import { response } from "express";
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
    
        
    
        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
    
        await modelo.save();
    
        res.json({ modelo });
        
    } catch (msg) {
        res.status(400).json({ msg });
    }

}

export {
    cargarArchivo,
    actualizarImagen
}