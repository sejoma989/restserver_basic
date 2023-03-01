import { response } from "express";
import { Producto } from "../models/index.js";

// ObtenerProductos - paginado - populate
const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate("usuario", "nombre")
            .populate("categoria", "nombre")
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })

}

// ObtenerProducto - populate
const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
        .populate("usuario", "nombre")
        .populate("categoria", "nombre")

    res.json({
        producto
    })
}


const crearProducto = async(req, res = response) => {
    
    req.body.nombre = req.body.nombre.toUpperCase();
    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: req.body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto( data )

    await producto.save();

    return res.status(201).json(producto);
    

}

// ActualizarProducto
const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data  } = req.body;

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    // Buscar en la BD el producto

    const producto = await Producto.findByIdAndUpdate( id, data, { new:true } )
        .populate("usuario", "nombre")
        .populate("categoria", "nombre")

    res.json({
        producto
    })

}

// BorrarProducto
const borrarProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, { estado:false } );

    res.json({
        producto
    })
}

export {
    obtenerProductos,
    obtenerProducto, 
    crearProducto,
    actualizarProducto,
    borrarProducto
}