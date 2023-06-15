//const { stdin, stdout } = require('process');
const { read } = require('fs');
const rolesController  = require('../controlador/RolesController.js');
const main = require('../main.js');
const readline = require('readline')

class rolesViews{
    

    constructor(uri){
        this.rol = new rolesController(uri);
        this.main = new main();
    }

    scanner = readline.createInterface({
        input: process.stdin,
        output:process.stdout
    })

    async verOpciones(){
        console.log("----Bienvenido----");
        this.scanner.question(`escoga la opcion que desee realizar
        1:Registrar rol
        2:ver roles
        3:buscar rol
        4:eliminar rol
        5:editar Rol 
        0: atras \n`
        
        ,async (opc)=>{
            opc = parseInt(opc);
            await this.realizarAcciones(opc);
        })
        // this.scanner.close();
    }

    async realizarAcciones(opc){
        switch (opc) {
            case 1:
                this.scanner.question("digite el id del rol: \n"
                , async(idRol)=>{
                   idRol  = parseInt(idRol);

                   this.scanner.question('igite el nombre del rol: \n'
                   , async(nombreRol)=>{
                     nombreRol  = nombreRol;

                     this.scanner.question("digite el estado del rol: \n"
                     ,async(estadoRol)=>{
                        estadoRol  = estadoRol;
                        await this.rol.insertarRol(idRol,nombreRol,estadoRol);
                        this.verOpciones();
                     });
                   }) ;
                }) ;
                break;
            case 2:
                await this.rol.verRoles();
                await this.verOpciones();
                break;
            case 3:
                 this.scanner.question(`digite id del rol que desea buscar`,(id)=>{
                    id = parseInt(id);
                    this.rol.buscarRol(id);
                })
                await this.verOpciones();
                break;
            case 4:
                this.scanner.question("digite el id el rol que desea eliminar: "
                ,async(idRol)=>{
                    idRol  = parseInt(idRol);
                    await this.rol.eliminarRol(idRol);
                    await this.verOpciones();
                })
                break;
            case 5:
                this.scanner.question("digite el id el Rol que desea actualizar: "
                , async(idRol)=>{
                   idRol  = parseInt(idRol);

                   this.scanner.question("digite el nuevo estado del Rol"
                   , async(estadoRol)=>{
                     nombreRol  = nombreRol;
                     await this.rol.editarRol(Rol,idRol);
                     await this.verOpciones();
                   }) ;
                }) ;
                break;
            case 0 :
                // const iniciar = new main();
                // iniciar.coleccion();
                await this.main.coleccion()
            // default:
            //     this.scanner.question(`digite una opcion valida por favor `,(opc)=>{
            //         const res  =parseInt(opc);
            //     })
            //     await this.verOpciones();
            //     break;
        }
    }
}
module.exports = rolesViews;