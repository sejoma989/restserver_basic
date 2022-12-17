import express from "express";
import cors from "cors"

import Usuarios from '../routes/usuarios.routes.js';
import auth from '../routes/auth.routes.js';

import { dbConnection } from "../database/config.js";


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

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

    }

    routes() {

        this.app.use( this.authPath, auth );
        this.app.use( this.usuariosPath, Usuarios );
    }


    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`)
        })
    }

}

export default Server
