const UsuarioController = require("../modelo/Usuario.js");
const {faker} = require ('@faker-js/faker');
const readline = require('readline');
const main = require('../main.js');

class UsuarioView{

    constructor(uri){
        this.usuario = new UsuarioController(uri);
        this.main = new main();
    }

     scanner  = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    
    async verOpciones(){
       
        console.log("<-------WELCOME--------->") 
           this.scanner.question(`<--chose a option -->
            1 : regitrar usuario
            2: ver usuarios
            3: buscar usuario
            4: actualizar usuario
            5: eliminar usuario
            0: atras
            9: salir
            `,(opc)=>{
                 opc  = parseInt(opc)
                this.realizarAcciones(opc);
                
            })
          
    }
    

    async realizarAcciones(opc){
        //const uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority"

        switch (opc) {

            case 1:
                this.scanner.question("cuantos usuarios desea registrar?:",async(numero)=>{
                    const numeroRegistros = parseInt(numero);
                
                const datosFaker  = [];
                const idUsuarios =  [];
           
                for (let i = 0; i < numeroRegistros; i++) {
                   const sexo = faker.person.sex();
                   var nombreUsuario = faker.person.firstName(sexo);
                   var apellidoUsuario = faker.person.lastName();
                   do{
                       var idUsuario = faker.number.int({min:1,max:5000});
                    }while(idUsuarios.includes(idUsuario));
                    idUsuarios.push(idUsuario);
                   
                   const datosAInsertar = {
                       idUsuario:idUsuario,
                       numeroDocumento : faker.number.int({min:10000, max:569999}),
                       nombreUsuario : nombreUsuario,
                       apellidoUsuario : apellidoUsuario,
                       passwordUsuario : faker.internet.password(),
                       idRol : faker.number.int({min:1, max:3}),
                       correoUsuario : faker.internet.email({firstName:nombreUsuario,lastName:apellidoUsuario})
                   
                       //correoUsuario : faker.internet.email({nombreUsuario,apellidoUsuario})
                   }
                   datosFaker.push(datosAInsertar);
                   
                }
                console.log(datosFaker);
                await this.usuario.insertarUsuario(datosFaker)
                await this.verOpciones();
            });
                break;
            case 2 :
                await this.usuario.verUsuarios();
                await this.verOpciones();
                break;
            case 3:
              this.scanner.question("digite el id el usuario: \n "
              , async(idUsuario)=>{
                idUsuario  = parseInt(idUsuario);
                  await this.usuario.buscarUsuario(idUsuario);
                
              }) 
              await this.verOpciones();
              break;
               
            case 4:
                this.scanner.question("digite el id el usuario que desea actualizar: \n"
                , async(idUsuario)=>{
                   idUsuario  = parseInt(idUsuario);

                   this.scanner.question("digite el nombre nuevo del usuario: \n"
                   , async(nombreUsuario)=>{
                     nombreUsuario  = nombreUsuario;
                     await this.usuario.actualizarUsuario(nombreUsuario,idUsuario);
                     await this.verOpciones();
                   }) ;
                }) ;
                break;
            case 5:
                this.scanner.question("digite el id el usuario: \n"
                ,async(idUsuario)=>{
                    idUsuario  = parseInt(idUsuario);
                    await this.usuario.eliminarUsuario(idUsuario);
                    await this.verOpciones();
                })
                break;
            case 9:
                console.log("gracias por usar nuestro sistema")
                process.exit();
            case 0:
                await this.main.coleccion();
                break;
            default:
               console.log("digite una opcion valida");
               this.verOpciones();
                break;
        }
    }

}

module.exports = UsuarioView;

// const vista = new UsuarioView();
// vista.verOpciones();



