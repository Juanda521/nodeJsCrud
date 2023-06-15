const {faker} = require ('@faker-js/faker');
//import { faker } from ;
const {MongoClient} = require('mongodb') ;//las llaves sirve para llamar exclusivamente las funciones que qeremos llamar del paquete 'mongodb'


const uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority"

//esta se crea para obtener los id de los libros ya existentes y para retornarlos en forma de array, para en otra funcion obtener ese valor y hacer procesos con estos

async function obtenerIdLibros() {
    
    const objectCliente = new MongoClient(uri);

    try {
        await objectCliente.connect();
         //seleccionamos de la coleccion libros solamente los id de los libros y esta consulta la convertimos en un array con la funcion toarray
        const result = await objectCliente.db('BookWare').collection('Libros').find({}).project({_id:0,idLibro:1}).toArray()
        return result; //se retorna el array con todos los id de los usuarios
    } catch (e) {
        console.log(e)
    }finally{
        console.log("se han enviado los id de los libros")
        await objectCliente.close();
    }
}
//funcion que se encarga de obtener y retornar los id de los usuarios

async function obtenerIdUsuaios() {
    const objectCliente = new MongoClient(uri);

    try{
    await objectCliente.connect();
    //seleccionamos de la coleccion usuarios solamente los id de los usuarios y esta consulta la convertimos en un array con la funcion toarray
    const result = await objectCliente.db('BookWare').collection('usuarios').find({}).project({_id:0,idUsuario:1}).toArray();
    return result; //se retorna el array con todos los id de los usuarios
    }catch (e){
        console.log(e)
    }finally{
        await objectCliente.close();
        console.log("se han enviado los id de los usuarios");
    }
}


//Crear peticion
async function  insertarPeticion(){
    const objectCliente  = new MongoClient(uri);

    try{
        await objectCliente.connect();
        
        const datosFakerPeticiones=[]
        var idPeticiones  = [];
         //como estamos utilizando una funcion asyncrona insertarPrestamos, podemos utilizar lo que nos retorna obtenerIdUsuarios y obtenerIdLibros
        const idUsuarios = await obtenerIdUsuaios();
        const idLibros = await obtenerIdLibros();

        const fechaPeticion= new Date();
        const diaPeticion= fechaPeticion.getDate();
        const mesPeticion= (fechaPeticion.getMonth()+1);
        const añoPeticion= fechaPeticion.getFullYear();
        
        for (let i=0;i<1000;i++){

            do{
                var idPeticion=faker.number.int({min:001,max:5000}); 
            }while(idPeticiones.includes(idPeticion));

            idPeticiones.push(idPeticion);
               //-----IMPORTANTE------//
            /*
            el arreglo de los id de los usuarios que recibimos anteriormente nos llegaron en formato json, el punto depsues del parentesis sirve para especificar que queremos el valor que esta en la clave especificada despues del punto
            */

            const idLibro = faker.helpers.arrayElement(idLibros).idLibro;
            const idUsuario=faker.helpers.arrayElement(idUsuarios).idUsuario;

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
      
       const resultado= await objectCliente.db('BookWare').collection('peticiones').insertMany(datosFakerPeticiones);
        if(resultado){
            console.log("Se han insertado los documentos")
        }else{
            console.log("No se insertaron los documentos")
        }
        }catch (e){
        console.log(e);
    }finally{
        await objectCliente.close();
    }
}

//insertarPeticion();

async function  buscarPeticion(idPeticion){
    const cliente  = new MongoClient(uri);
    try{
        await cliente.connect();
        const resultado = await cliente.db('BookWare').collection('peticiones').aggregate([{
            $match:{idPeticion:idPeticion}
        }]).toArray();
        console.log(resultado)
    }catch(e){
        console.log(e);
    }finally{
        await cliente.close();
    }
}
//buscarPeticion(2781)

async function verPeticiones() {
    const cliente  = new MongoClient(uri);
    try{
        await cliente.connect();
        const resultado = await cliente.db('BookWare').collection('peticiones').aggregate([ {
            $lookup:{
             from: 'Libros',
             localField: 'idLibro',
             foreignField: 'idLibro',
             as: 'libro'
            }
         },{
             $lookup:{
                 from: 'usuarios',
                 localField: 'idUsuario',
                 foreignField: 'idUsuario',
                 as: 'usuario'
             }  
         }]).limit(5).toArray();
        //console.log(resultado)
        console.log(JSON.stringify(resultado,null,2));
    }catch(e){
        console.log(e);
    }finally{
       
        await cliente.close();
    }
}
verPeticiones();


//funcion eliminar peticion de la coleccion

async function eliminarPeticion(idPeticion){
    const cliente  = new MongoClient(uri)
    try{
        const result  = await cliente.db('BookWare').collection('peticiones').deleteOne({
            "idPeticion" : idPeticion
        });
    }catch(e){
        console.log(e)
    }finally{
        await cliente.close();
        console.log('se ha eliminado la peticion');
    }
}
//eliminarPrestamo()

async function crearColeccion() {
    
    const cliente = new MongoClient(uri);

    try{
        await cliente.connect();
        const result = await cliente.db('BookWare').createCollection("peticiones",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionPrestamoLibros',
                    required:['idPeticion','idLibro','idUsuario','estadoPeticion','motivoPeticion','fechaPeticion'],
                    properties:{
                        idPeticion:{
                            bsonType:'int'
                        },
                        idLibro :{
                            bsonType: 'int'
                        },
                        idUsuario:{
                            bsonType: "int"
                        },
                        estadoPeticion : {
                            bsonType: "string"
                        },
                        motivoPeticion : {
                            bsonType: "string"
                        },
                        fechaPeticion : {
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