import Role from '../models/role.js';
import Usuario from "../models/usuario.js";



const esRoleValido = async(rol='') => {

    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`El rol ${rol} no esta registrado en base de datos`)
    }
}

const emailExiste = async(correo='') => {

    const emailRepetido = await Usuario.findOne({ correo });
    if ( emailRepetido ) {
        throw new Error(`Este correo: ${correo} ya ha sido registrado`);
    }
}   

const existeUsuarioPorId = async(id='') => {

    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id: ${id} no existe`);
    }
}  

export {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}