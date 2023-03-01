import { Router } from "express";
import { check } from 'express-validator';

import { validarArchivoSubir, validarCampos } from "../middlewares/index.js";
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from "../controllers/uploads.js";
import { coleccionesPermitidas } from "../helpers/db-validators.js";

const router = Router();


router.post( '/', validarArchivoSubir, cargarArchivo );

router.put( '/:coleccion/:id',[
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
// ], actualizarImagen )
], actualizarImagenCloudinary);

router.get( '/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    validarCampos
], mostrarImagen );


export default router;
