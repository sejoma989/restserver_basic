import { response } from "express";
import { Categoria } from "../models/index.js";

// ObtenerCategorias - paginado - populate
const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado : true }

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("usuario", "nombre")
    ]);

    res.json({
        total, 
        categorias
    });
}

// ObtenerCategoria - populate
const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id )
        .populate("usuario", "nombre")

    res.json({
        categoria
    })
}


const crearCategoria = async(req, res = response) => {

    const nombre =  req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Genera data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
    }

    const categoria = new Categoria( data );

    // Guardar en DB
    await categoria.save();

    return res.status(201).json(categoria);
      
}

// ActualizarCategoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    // Buscar categorias en la BD

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new:true })

    res.json({
        categoria
    })


}

// BorrarCategoria
const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado:false } );

    res.json({
        categoria
    })
}

export {
    obtenerCategorias,
    obtenerCategoria, 
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}