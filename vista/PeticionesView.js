const PeticionesController  = require("../controlador/peticionesController.js");
const UsuarioController = require("../controlador/UsuarioController.js");
const LibrosController = require('../controlador/LibrosController.js');
const readline = require('readline');
const {faker} = require ('@faker-js/faker');

class PeticionesView{

    constructor(uri){
        this.peticion =  new PeticionesController(uri);
        this.usuario = new UsuarioController(uri);
        this.libro = new LibrosController(uri);
    }

    scanner = readline.createInterface({
        input:process.stdin,
        output:process.stdout
    })

    async  verOpciones(){
       
        this.scanner.question(`eliga la accion que desea hacer
        1: insertar peticion
        2: ver peticiones
        3: buscar peticion
        4: actualizar Peticion
        5: eliminar Peticion
        0: salir`,(opc)=>{
            opc = parseInt(opc);
            this.realizarAcciones(opc);
        })
    }

    async realizarAcciones(opc){
        switch (opc) {
            case 1:
                const datosFakerPeticiones  = [];
                const idUsuarios = await this.usuario.obtenerIdUsuarios();
                const idLibros  = await this.libro.obteneridLibros();
                const idPeticiones = [];
                const fechaPeticion= new Date();
                const diaPeticion= fechaPeticion.getDate();
                const mesPeticion= (fechaPeticion.getMonth()+1);
                const añoPeticion= fechaPeticion.getFullYear();
           
                for (let i = 0; i <1; i++) {
                  
                    do{
                        var idPeticion=faker.number.int({min:1,max:2000}); 
                    }while(idPeticiones.includes(idPeticion));

                    idPeticiones.push(idPeticion);
                    //-----IMPORTANTE------//
                    /*
                    el arreglo de los id de los usuarios que recibimos anteriormente nos llegaron en formato json, el punto depsues del parentesis sirve para especificar que queremos el valor que esta en la clave especificada despues del punto
                    */

                    const idLibro = faker.helpers.arrayElement(idLibros).idLibro;
                    const idUsuario =faker.helpers.arrayElement(idUsuarios).idUsuario;

                    const estadoPeticion = faker.helpers.arrayElement(['PENDIENTE','ACEPTADA']);
                    const motivoPeticion = faker.helpers.arrayElement(['PRESTAMO DE LIBRO','RESERVA DE LIBRO']);
                    const fechaPeticion=faker.date.between({from:`${añoPeticion}-${mesPeticion}-${diaPeticion}`},{to:`${añoPeticion}-12-31`})
                    
                    
                    const datosInsertar={
                        idPeticion:idPeticion,
                        idLibro:idLibro,
                        idUsuario:idUsuario,
                        estadoPeticion:estadoPeticion,
                        motivoPeticion:motivoPeticion,
                        fechaPeticion:fechaPeticion
                    }
                    datosFakerPeticiones.push(datosInsertar);
                    console.log(`se han creado: ${i} registros`)       
                }
                console.log(datosFakerPeticiones);
                await this.peticion.insertarPeticion(datosFakerPeticiones);
                await this.verOpciones();
                break;
            case 2:
                await this.peticion.verPeticiones();
                 this.verOpciones()
                break;
            case 3:
                this.scanner.question(`digite el id de la peticion que desea buscar: `,(opc)=>{
                opc = parseInt(opc)
                    this.peticion.buscarPeticion(opc)
                })
                await this.verOpciones();
                break;
            case 4:
                console.log("disculpa pero las peticiones no se pueden editar, solo las puedes cancelar (eliminar)")
                this.verOpciones();
                break;
            case 5:
                 this.scanner.question(`digite el id de la peticion que desea eliminar`,(id)=>{
                this.peticion.eliminarPeticion(id)
                })
                await this.verOpciones();
                break;
            case 0:
                console.log("gracias por usar nuestro sistema");
                process.exit()
            default:
                console.log("digite una opcion valida por favor");
                this.verOpciones();
                break;
        }
    }
}

module.exports  = PeticionesView;