// {
//     nombre: 'pepito',
//     email: 'pepito@gmail.com',
//     password: '1811681',
//     img: 'edfnorlnge',
//     rol: 'admin',
//     estado: false,
//     google: false
// }

import { Schema, model } from 'mongoose';

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        // enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    
});

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuarioSinPassword } = this.toObject();
    usuarioSinPassword.uid = _id;
    return usuarioSinPassword;
}

export default model( 'Usuario', UsuarioSchema );
