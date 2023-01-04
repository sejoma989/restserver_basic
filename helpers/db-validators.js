import { 
    Usuario,
    Role,
    Categoria, 
    Producto} from '../models/index.js';
// import Role from '../models/role.js';
// import Usuario from "../models/usuario.js";



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
        throw new Error(`El usuario con id: ${id} no existe`);
    }
}  

const existeCategoriaPorId = async(id='') => {

    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error(`La categoria con id: ${id} no existe`);
    }
}  

const existeProductoPorId = async(id='') => {

    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) {
        throw new Error(`El producto con id: ${id} no existe `)
    }
}

export {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}