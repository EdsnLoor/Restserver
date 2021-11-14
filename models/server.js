const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../Database/config');


class Server {

    constructor(){
        this.app = express()
        this.port=process.env.PORT;
        this.usuariosPath='/api/usuarios';
        this.authPath ='/api/auth';

        //conectar base de datos
        this.conectarDB();
        
        //Middlewares
        this.middlewares();

        //cors
        this.app.use(cors());

        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares (){
        //CORS
        this.app.use(cors());

        //Lectura y parseo dle body
        this.app.use(express.json());

        //Directorio publio
        this.app.use(express.static('public'));
    }
    
    routes(){
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath,require('../routes/usuarios'));

    }

    listen (){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports=Server;