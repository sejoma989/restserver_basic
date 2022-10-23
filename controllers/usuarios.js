import {request, response} from "express";


const usuariosGet = (req = request, res = response) => {

    const {q, nombre='No name', apikey, page = 1, limit =10} = req.query;

    res.json({
        // "ok":true,
        msg: "get API - desde el controlador",
        q,
        nombre,
        apikey,
        page,
        limit
    });
}


const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        // "ok":true,
        msg: "post API - desde el controlador",
        nombre,
        edad
    });
}


const ususariosPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        // "ok":true,
        msg: "put API - desde el controlador", 
        id
    });
}


const usuariosPatch = (req, res = response) => {
    res.json({
        // "ok":true,
        msg: "patch API - desde el controlador"
    })
}


const usuariosDelete = (req, res = response) => {
    res.json({
        // "ok":true,
        msg: "delete API - desde el controlador"
    })
}


export {
    usuariosGet,
    usuariosPost,
    ususariosPut,
    usuariosPatch,
    usuariosDelete
}