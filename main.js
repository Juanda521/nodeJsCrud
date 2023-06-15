
require ('dotenv').config();
const readline = require('readline');

class main{
    
    uri  = null;

    constructor(){
        //this.uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority";
        this.uri = process.env.URI;
    }

    scanner = readline.createInterface({
        input:process.stdin,
        output:process.stdout
    })


    async coleccion(){
        this.scanner.question(`escoga la coleccion con la cual desea interactuar
        1:roles
        2:usuarios
        3:peticiones
        4:prestamos
        5:libros
        6:reservas
        7:devoluciones
        8:sanciones 
        `,(opc)=>{
            opc  =parseInt(opc);
            this.llamarClase(opc);
            
        })
    }
    
    async llamarClase(opc){
        switch (opc) {
            case 1:
                const RolesView = require('./vista/RolesView.js');
                const Rol = new RolesView(this.uri);
                await Rol.verOpciones();
                break;
            case 2:
                const UsuarioView = require('./vista/UsuarioView.js');
                const Usuario = new UsuarioView(this.uri);
                await Usuario.verOpciones();
                break;
            case 3:
                const PeticionesView  = require('./vista/PeticionesView.js');
                const peticion = new PeticionesView(this.uri);
                await peticion.verOpciones();
                break;
            case 4:
                const PrestamosViews  =require('./vista/PrestamosView.js');
                const Prestamo = new PrestamosViews(this.uri);
                await Prestamo.verOpciones();
                break;
            case 5:
                const LibrosView  = require('./vista/LibrosView.js');
                const Libro = new LibrosView(this.uri);
                await Libro.verOpciones();
                break;
            default:
                break;
        }
    }

}

module.exports = main;
const iniciar = new main();
iniciar.coleccion();


