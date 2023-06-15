
const {faker} = require ('@faker-js/faker');
const Roles = require("../modelo/Roles.js")

class RolesController{

    constructor(uri){
    this.rol =  new Roles(uri);
    }

    async insertarRol(idRol,nombreRol,estadoRol){
        this.rol.insertarRol(idRol,nombreRol,estadoRol);
    }

    async verRoles() {
      this.rol.verRoles();
    }

    async buscarRol(idRol){
        this.rol.buscarRol(idRol);
    }

    async eliminarRol(idRol){
        this.rol.eliminarRol(idRol);
    }

    async editarRol(idRol,estadoRol){
        this.rol.actualizarRol(idRol,estadoRol);
    }



}

module.exports  = RolesController;

//  uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority"

// const prueba = new UsuarioController(uri);
// //prueba.insertarUsuario()
// prueba.buscarUsuario(2195)