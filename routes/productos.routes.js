import { Router } from "express";
import { check } from 'express-validator';
import { 
    actualizarProducto,
    borrarProducto,
    crearProducto, 
    obtenerProducto, 
    obtenerProductos 
} from "../controllers/productos.js";
import { existeCategoriaPorId, existeProductoPorId } from "../helpers/db-validators.js";

import { 
    esAdminRole,
    validarCampos,
    validarJWT
} from "../middlewares/index.js";

const router = Router();

/**
 * {{url}}/api/Productos
 */

// Obtener todas las Productos - publico
router.get('', obtenerProductos );

// Obtener una Producto por ID - publico
router.get('/:id', [
    check('id', 'Ingrese un id valido de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Crear una Producto por ID - privado - cualquier role, persona con jwt
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'El producto tiene que estar en una categoria').not().isEmpty(),
    check('categoria', 'Ingrese un MongoId valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos,
], crearProducto);

// Actualizar registro por ID - privado, cualquiera copn jwt
router.put('/:id', [
    validarJWT,
    check('id', 'Ingrese un id valido de mongo').isMongoId(),
    // check('nombre', 'Ingrese el nuevo nombre del producto').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    // check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], actualizarProducto);

// Borrar una Producto por ID - privado - solo rol Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'Ingrese un id valido de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);

export default router;
