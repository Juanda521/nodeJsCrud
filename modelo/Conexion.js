
const {MongoClient} = require('mongodb') ;//las llaves sirve para llamar exclusivamente las funciones que qeremos llamar del paquete 'mongodb'


class Conexion{
 
     
    constructor(uri){
        this.uri  = uri;
        this.client  = null
        //console.log("tienes conexion")
    }


    
    async conectar(){
        try {
            this.client  = new MongoClient(this.uri);
           await this.client.connect();
           return this.client;
        } catch (error) {
            console.log("error al conectarse a la base de datos",error)
        }
    }

   

}

module.exports  = Conexion;