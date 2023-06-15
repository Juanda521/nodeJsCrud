const {faker} = require ('@faker-js/faker');
//import { faker } from ;
const {MongoClient} = require('mongodb') ;//las llaves sirve para llamar exclusivamente las funciones que qeremos llamar del paquete 'mongodb'

//require ('dotenv').config()

const uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority"

//funcion eliminar prestamo de la tabla

async function eliminarPrestamo(idPrestamo){
    const cliente  = new MongoClient(uri)
    try{
       
        const result  = await cliente.db('BookWare').collection('prestamoLibros').deleteOne({
            "idPrestamo" : idPrestamo
        });
        console.log('melos');
        return result; //se retorna el array con todos los id de los usuarios
    }catch(e){
        console.log(e)
    }finally{
        await cliente.close();
        console.log('se ha eliminadoel prestamo');
    }
}
//eliminarPrestamo()

const verPrestamos  = async() =>{
   
    const cliente  = new MongoClient(uri)
    try{
        const result  = await cliente.db('BookWare').collection('Sanciones').find({}).limit(50).toArray()
        console.log(JSON.stringify(result,null,2));
        // const result  = await cliente.db('BookWare').collection('prestamos').aggregate([
        //     {
        //        $lookup:{
        //         from: 'peticiones',
        //         localField: 'idPeticion',
        //         foreignField: 'idPeticion',
        //         as: 'peticion'
        //        }
        //     },{
        //         $lookup:{
        //             from: 'usuarios',
        //             localField: 'peticion.idUsuario',
        //             foreignField: 'idUsuario',
        //             as: 'usuario'
        //         }
        //     },{
        //         $lookup:{
        //             from: 'Libros',
        //             localField: 'peticion.idLibro',
        //             foreignField: 'idLibro',
        //             as: 'libro'
        //         }
        //     }

        // ]).limit(10).toArray();
        // //console.log(result);
        // console.log(JSON.stringify(result,null,2));
  
    }finally{
        //await cliente.close();
        console.log('todo salio fine');
    }
}

verPrestamos();

const obtenerIdPeticiones =  async()=>{
    const objectCliente  = new MongoClient(uri)
    try {
        await objectCliente.connect();
        const resultado  = objectCliente.db('BookWare').collection('peticiones').aggregate([{
            $project:{
                _id:0,idPeticion:1
            }
        }]).toArray()
        console.log("estamo llegando aca?")
        return resultado;
    } catch (e) {
        console.log(e);
    }finally{
        console.log("se enviarlos los id de las peticiones")
       // await objectCliente.close();
        
    }
}


//funcion que se encarga de recibir los id de las peticiones y realizar la insercion a la coleccion prestamos
const insertarPrestamos = async() =>{
    const objectCliente  = new MongoClient(uri);

    try {
        await objectCliente.connect();
        const datosFaker = []; //este sera el array principal que contendra todos los documentos que enviaremos a la coleccion 
        
        var idPrestamos  =[]; //esto para almacenar los id que nos genere el faker

      const idPeticiones  = await obtenerIdPeticiones();

        //obtenemos el año, mes y dia de cuando se este ejecutando la funcion
        const fechaActual = new Date();
        const diaActual  = fechaActual.getDate();
        const mesActual  = (fechaActual.getMonth()+1);//el + 1 es porque el sistema reconoce enero como el mes 0, entonces toca sumarle 1 para reconocerlo como calendario humano
        const añoActual = fechaActual.getFullYear();
        
        //se crea el ciclo para el proceso de generar los datos
        for (let i = 0; i <2; i++) {

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
      
        const result  = await objectCliente.db('BookWare').collection('prestamos').insertMany(datosFaker);
        if (result){
            console.log('vamos volando')
        }
    } catch (e) {
        console.log(e)
    }finally{
        await objectCliente.close();
    }
}

//insertarPrestamos();



async function crearColeccion() {
    
    const cliente = new MongoClient(process.env.URI);

    try{
        await cliente.connect();
        const result = await cliente.db('BookWare').createCollection("prestamos",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionPrestamoLibros',
                    required:['idPrestamo','idPeticion','estadoPrestamo','fechaPrestamo','fechaDevolucion'],
                    properties:{
                        idPrestamo:{
                            bsonType:'int'
                        },
                        idPeticion:{
                            bsonType:'int'
                        },
                        estadoPrestamo : {
                            bsonType: "string"
                        },
                        fechaPrestamo : {
                            bsonType: "date"
                        },
                        fechaDevolucion : {
                            bsonType: "date"
                        }
                    }
                }
            }
        })
        if (result){
            console.log("coleccion creada correctamente");
        }else{
            console.log("no se ha creado");
        }
    }catch(e){
        console.log(e);
    }finally{
        await cliente.close();
    }

}

//crearColeccion();