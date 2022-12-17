import Router from "express";
import { check } from 'express-validator';

import { 
    validarCampos,
    validarJWT,
    esAdminRole, 
    tieneRole
} from '../middlewares/index.js'


import { 
    esRoleValido, 
    emailExiste,
    existeUsuarioPorId 
} from "../helpers/db-validators.js";

import { 
    usuariosDelete, 
    usuariosGet, 
    usuariosPatch, 
    usuariosPost, 
    usuariosPut 
} from "../controllers/usuarios.js";



const router = Router();

router.get('/', usuariosGet );

router.post('/',[
    check('nombre', 'El nombre es obligatorio!').not().isEmpty(),
    check('correo', 'El correo no es valido!').isEmail(),
    check('correo').custom( (correo) => emailExiste(correo)),
    check('password', 'Ingrese una contraseña de más de 6 letras!').isLength({ min:6 }),
    check('rol').custom( (rol) => esRoleValido(rol)),     // check('rol', 'No existe ese rol!').isIn(['ADMIN_ROLE', 'USER_ROLE']),

    validarCampos
],usuariosPost );

router.put('/:id', [
    check('id', 'Ingrese un id valido de mongo').isMongoId(),
    check('id').custom( existeUsuarioPorId ),           // check('id').custom( (id) => existeUsuarioPorId( id ) ),
    check('rol').custom( (rol) => esRoleValido(rol)),
    validarCampos
], usuariosPut );

router.patch('/', usuariosPatch );

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'NOSE_ROLE'),
    check('id', 'Ingrese un id valido de mongo').isMongoId(),
    check('id').custom( existeUsuarioPorId ),   
    validarCampos
] , usuariosDelete );


export default router;