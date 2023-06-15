
const {faker} = require ('@faker-js/faker');
const Usuario = require("../modelo/Usuario.js")

class UsuarioController{

    constructor(uri){
    this.usuario =  new Usuario(uri);
    }
   
    //usuario = new Usuario(uri);

    async insertarUsuario(datosFaker){
       await this.usuario.insertarUsuario(datosFaker);
    }


    async verUsuarios() {
        this.usuario.verUsuarios();
    }

    async buscarUsuario(idUsuario){
        this.usuario.buscarUsuario(idUsuario)
    }

    async eliminarUsuario(idUsuario){
        this.usuario.buscarUsuario(idUsuario)
    }

    async editarUsuario(nombreUsuario,idUsuario){
        this.usuario.actualizarUsuario(nombreUsuario,idUsuario)
    }

    async obtenerIdUsuarios(){
        const idUsuarios = this.usuario.obteneridUsuarios();
        return idUsuarios;
    }

}

module.exports  = UsuarioController;

//  uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority"

// const prueba = new UsuarioController(uri);
// //prueba.insertarUsuario()
// prueba.buscarUsuario(2195)