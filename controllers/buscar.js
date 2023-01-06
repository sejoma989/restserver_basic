import { query, response } from "express";
import { isValidObjectId } from "mongoose";
import {
    Categoria, 
    Producto, 
    Usuario 
} from "../models/index.js";

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];


const buscarUsuarios = async ( termino = '', res = response ) => {
    /**
     * @async Funcion auxiliar de buscar que realiza la busqueda en coleccion de usuarios.
     * Evalua si el termino de busqueda es ID de mongo y devuelve un usuario
     * @params termino, res
     * @return json(results[ usuario || [usuarios] ])
     */

    // Validacion del termino de busqueda como un mongo ID
    const esMongoId = await isValidObjectId( termino );

    if ( esMongoId ) {
        // Busqueda de termino como mongo ID        
        const usuario = await Usuario.findById( termino )
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] 
        })
    }

    // Expresion regular que vuelve no case sensitive la busqueda
    const regex = new RegExp( termino, 'i' );

    // Busqueda de termino como string nombre || correo solo activos
    const query = { 
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{ estado: true }]
    }

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ])

    res.json({
        total,
        results: usuarios
    })

}

const buscarCategorias = async ( termino = '', res = response ) => {

    const esMongoId = await isValidObjectId( termino );

    if ( esMongoId ) {
        // Busqueda de termino como mongo ID        
        const categoria = await Categoria.findById( termino )
        return res.json({
            results: ( categoria ) ? [ categoria ] : [] 
        })
    }

    const regex = new RegExp( termino, 'i' );

    const query = { nombre: regex , estado: true }

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    res.json({
        total,
        results: categorias
    })

}

const buscarProductos = async ( termino = '', res = response ) => {

    const esMongoId = await isValidObjectId( termino );

    if ( esMongoId ) {
        const producto = await Producto.findById( termino )
            .populate('categoria', 'nombre')
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const query = {
        $or: [{nombre: regex}, {descripcion: regex}],
        $and: [{ estado: true }]
    }

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        results: productos
    })

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res )
        break;

        case 'categorias':
            buscarCategorias( termino, res )
        break;
    
        case 'productos':
            buscarProductos( termino, res )    
        break;

        default:
            res.status(500).json({
                msg: 'Se nos olvido hacer esta busqueda... Ups!'
            })
            break;
    }
}

export {
    buscar
}