import express from "express";
import cors from "cors"
import fileUpload from "express-fileupload";

import auth from '../routes/auth.routes.js';
import buscar from '../routes/buscar.routes.js';
import categorias from '../routes/categorias.routes.js';
import productos from '../routes/productos.routes.js';
import uploads from '../routes/uploads.routes.js';
import usuarios from '../routes/usuarios.routes.js';

import { dbConnection } from "../database/config.js";


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Antiguo llamado a los path
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';

        // Creacion de objeto paths
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads',
            usuarios:   '/api/usuarios',
        }


        // Conectar a BD
        this.conectarDB();
        
        // middlewares
        this.middlewares();

        // Rutas de la aplicacion
        this.routes();
        
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public'));

        // Fileupload - carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use( this.paths.auth, auth );
        this.app.use( this.paths.buscar, buscar );
        this.app.use( this.paths.categorias, categorias );
        this.app.use( this.paths.productos, productos )
        this.app.use( this.paths.uploads, uploads );
        this.app.use( this.paths.usuarios, usuarios );
    }


    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`)
        })
    }

}

export default Server
