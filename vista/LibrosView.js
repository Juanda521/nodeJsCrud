const LibrosController  = require ('../controlador/LibrosController.js');
const {faker} = require ('@faker-js/faker');
const readline = require('readline');

class LibrosView{

    constructor(uri){
        this.Libro = new LibrosController(uri);
    }

    scanner  = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    
    async verOpciones(){
       
        console.log("<-------WELCOME--------->") 
           this.scanner.question(`<--chose a option -->
            1 : regitrar libro
            2: ver Libros
            3: buscar libro
            4: actualizar libro
            5: eliminar libro
            0: salir
            `,(opc)=>{
                 opc  = parseInt(opc)
                this.realizarAcciones(opc);
            })
    }

    async realizarAcciones(opc){
        //const Libro  =new LibrosController();
    
        switch (opc) {
            case 1:
               console.log("estamos trabajando en esta opcion")
                break;
            case 2 :
                await this.Libro.verLibros();
                await this.verOpciones();
                break;
            case 3:
              this.scanner.question("digite el id del libro: "
              , async(idLibro)=>{
                idLibro = parseInt(idLibro);
                 await this.Libro.buscarLibro(idLibro);
                 await this.verOpciones();
              }) 
              break;
            case 4:
                this.scanner.question("digite el id el libro que desea actualizar: "
                , async(idLibro)=>{
                   idLibro  = parseInt(idLibro);

                   this.scanner.question("digite el nombre nuevo del libro"
                   , async(nombreLibro)=>{
                     nombreLibro  = nombreLibro;
                     await this.Libro.actualizarLibro(nombreLibro,idLibro);
                     await this.verOpciones();
                   }) ;
                }) ;
                break;
            case 5:
                this.scanner.question("digite el id del libro: "
                ,async(idLibro)=>{
                    idLibro  = parseInt(idLibro);
                    await this.Libro.eliminarLibro();
                    await this.verOpciones();
                })
                break;
            case 0:{
                console.log("gracias por usar nuestro sistema")
                process.exit();
            }
            default:
               console.log("digite una opcion valida");
               this.verOpciones();
                break;
        }
    }

}

module.exports = LibrosView;

// const vista = new UsuarioView();
// vista.verOpciones();



