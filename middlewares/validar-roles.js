import { request, response } from 'express'

const esAdminRole = (req = request, res = response, next) => {

    // validar si ya se valido el jwt
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    // validar si el usuario es ADMIN
    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${nombre} no es ADMIN - Aqui no hacemos eso`
        });
    }

    next();
}

const tieneRole = ( ...roles ) => {

    return (req = request, res = response, next) => {

        // validar si ya se valido el jwt
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        // validar si el rol del usuario esta en el arreglo permitido roles
        if ( !roles.includes( req.usuario.rol ) ) {

            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}` 
            });
        }

        // console.log(roles, req.usuario.rol);
        next();
    }
}

export {
    esAdminRole,
    tieneRole
}