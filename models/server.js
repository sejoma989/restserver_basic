import express from "express";
import cors from "cors"

import routerUsuarios from '../routes/usuarios.routes.js';


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usuariosPath = '/api/usuarios';
        
        // middlewares
        this.middlewares();

        // Rutas de la aplicacion
        this.routes();
        
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

        this.app.use( this.usuariosPath, routerUsuarios );

    }


    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`)
        })
    }

}

export default Server
