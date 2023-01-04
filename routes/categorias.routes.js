import { Router } from "express";
import { check } from 'express-validator';
import { 
    actualizarCategoria,
    borrarCategoria,
    crearCategoria, 
    obtenerCategoria, 
    obtenerCategorias 
} from "../controllers/categorias.js";
import { existeCategoriaPorId } from "../helpers/db-validators.js";

import { 
    esAdminRole,
    validarCampos,
    validarJWT
} from "../middlewares/index.js";

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('', obtenerCategorias );

// Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'Ingrese un id valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria);

// Crear una categoria por ID - privado - cualquier role, persona con jwt
router.post('/', [ 
    validarJWT,
    // check('id', 'Ingrese un id valido de mongo').isMongoId(),
    check('nombre','El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);

// Actualizar registro por ID - privado, cualquiera copn jwt
router.put('/:id', [
    validarJWT,
    check('nombre', 'Ingrese el nuevo nombre de la categoria').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);

// Borrar una categoria por ID - privado - solo rol Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'Ingrese un id valido de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);

export default router;
