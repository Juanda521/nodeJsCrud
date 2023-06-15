const Peticiones  = require('../modelo/Peticiones.js');
const Usuario  = require('../modelo/Usuario.js');


class PeticionesController{

    constructor(uri){
        this.peticion = new Peticiones(uri),
        this.Usuario =  new Usuario(uri)
    }

    async insertarPeticion(datosAInsertar){
     await this.peticion.insertarPeticion(datosAInsertar);
    }

   async verPeticiones(){
    await this.peticion.verPeticiones();
   }

   async buscarPeticion(idPeticion){
    await this.peticion.buscarPeticion(idPeticion)
   }

   async eliminarPeticion(idPeticion){
    await this.peticion.eliminarPeticion(idPeticion)
   }
}
module.exports = PeticionesController;

