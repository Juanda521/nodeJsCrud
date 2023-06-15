//const { stdin, stdout } = require('process');
const PrestamosController  = require('../controlador/PrestamosController.js');
const readline = require('readline')

const {faker} = require ('@faker-js/faker');

class PrestamosViews{
    

    constructor(uri){
        this.Prestamo = new PrestamosController(uri);
    }

    scanner = readline.createInterface({
        input: process.stdin,
        output:process.stdout
    })

    async verOpciones(){
        console.log("----Bienvenido----");
        this.scanner.question(`escoga la opcion que desee realizar
        1:Registrar Prestamo
        2:ver Prestamos
        3:buscar Prestamo
        \n`
        ,async (opc)=>{
            opc = parseInt(opc);
            await this.realizarAcciones(opc);
        })
    }

    async realizarAcciones(opc){
        switch (opc) {
            case 1:
                this.scanner.question("cuantos prestamos desea registrar?:",async(numero)=>{
                    const numeroRegistros = parseInt(numero); 
                
                    const datosFaker = []; //este sera el array principal que contendra todos los documentos que enviaremos a la coleccion 
                        
                    var idPrestamos  =[]; //esto para almacenar los id que nos genere el faker
            
                    const idPeticiones  = await obtenerIdPeticiones();
            
                    //obtenemos el año, mes y dia de cuando se este ejecutando la funcion
                    const fechaActual = new Date();
                    const diaActual  = fechaActual.getDate();
                    const mesActual  = (fechaActual.getMonth()+1);//el + 1 es porque el sistema reconoce enero como el mes 0, entonces toca sumarle 1 para reconocerlo como calendario humano
                    const añoActual = fechaActual.getFullYear();
                    
                    //se crea el ciclo para el proceso de generar los datos
                    for (let i = 0; i <numeroRegistros; i++) {
            
                        let idPrestamo;
                        //este ciclo se ejecuta cada vez que el numero que nos genere el faker, no pertenezca al array idPrestamos
                        do{
                            idPrestamo  = faker.number.int({min:1,max:5000});
                        }while(idPrestamos.includes(idPrestamo)); //si el array ya contiene el idprestamo que nos genero el faker se ejecuta el ciclo
                        
            
                        idPrestamos.push(idPrestamo); //inserta el id a el arreglo cuando el faker genere uno que no existia 
            
                        //-----IMPORTANTE------//
                        /*
                        el arreglo de los id de los usuarios que recibimos anteriormente nos llegaron en formato json, el punto depsues del parentesis sirve para especificar que queremos el valor que esta en la clave especificada despues del punto
                        */
                        let idPeticion;
                        //este ciclo se ejecuta cada vez que el numero que nos genere el faker, no pertenezca al array idPeticiones, esto para asegurarnos que el cada prestamo solamente tenga una peticion
                        do{
                             idPeticion  = faker.helpers.arrayElement(idPeticiones).idPeticion; 
                        }while(idPeticiones.includes(idPeticion)); //si el array ya contiene el idprestamo que nos genero el faker se ejecuta el ciclo
                        
                   
                        const estadoPrestamo = faker.helpers.arrayElement(['ACTIVO','EN TARDIA']);
                    
                        // console.log(`hoy es ${diaActual} del ${mesActual} del año ${añoActual}`);
                        //generamos la fecha del prestamos entre el dia que se este ejecutando la funcion, y una fecha maxima hasta el final del año actual
                        const fechaPrestamo = faker.date.between({from:`${añoActual}-${mesActual}-${diaActual}`}, {to:`${añoActual}-12-31`});
            
                        //creamos un objeto tipo date donde lo instanciamos de entrada con la fecha que nos se nos genero en prestamo 
                        const fechaDevolucion  = new Date(fechaPrestamo);
                        //se le suman 15 dias a la fecha que se hizo el prestamo, esta sera la fecha de devolucion
                        fechaDevolucion.setDate(fechaDevolucion.getDate()+15);
            
                        console.log(typeof idPrestamo)
                        console.log(typeof idPeticion)
                        console.log(typeof estadoPrestamo)
                        console.log(typeof fechaPrestamo)
                        console.log(typeof fechaDevolucion)
                        
                        //se crea el documento json con sus claves y sus valores
                        const datoInsertar  = {
                            
                            idPrestamo: idPrestamo,
                            idPeticion: idPeticion,
                            estadoPrestamo : estadoPrestamo,
                            fechaPrestamo : fechaPrestamo,
                            fechaDevolucion  : fechaDevolucion
            
                        }
                        
                        datosFaker.push(datoInsertar); //se le inserta al array principal el documento creado
                       console.log(`se han generado ${i} documentos`)
                    }
                  
                    await this.Prestamo.insertarPrestamo(datosFaker)
                })
                await this.verOpciones();
                break;
            case 2:
                await this.Prestamo.verPrestamos();
                await this.verOpciones();
                break;
            case 3:
                 this.scanner.question(`digite id del prestamo que desea buscar`,(opc)=>{
                    id = parseInt(opc);
                    this.Prestamo.buscarPrestamo(id);
                })
                await this.verOpciones();
                break;
            default:
                this.scanner.question(`digite una opcion valida por favor `,(opc)=>{
                    const res  =parseInt(opc);
                })
                await this.verOpciones();
                break;
        }
    }
}
module.exports = PrestamosViews;