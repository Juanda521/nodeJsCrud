//requerimos el paquete faker para trabajar con el
//const faker = require('faker');
const {faker} = require ('@faker-js/faker');
//import { faker } from ;
const {MongoClient} = require('mongodb') ;//las llaves sirve para llamar exclusivamente las funciones que qeremos llamar del paquete 'mongodb'


const uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority"


const eliminarColeccion = async() =>{

const cliente  = new MongoClient(uri);
try {
    await cliente.connect();
    const resultado = await cliente.db('BookWare').collection('Sanciones').drop();
    if (resultado){
        console.log("se ha eliminado la coleccion");
    }
} catch (e) {
    console.log(e)
}finally{
    await cliente.close();
}
}

//eliminarColeccion();

const actualizarUsuario  = async()  =>{
    const cliente  = new MongoClient(uri);
    try {
        await cliente.connect();
        const resultado = await cliente.db('BookWare').collection('usuarios').updateOne({

        })
        if (resultado){
            console.log("se ha actualizado el usuario");
        }
    } catch (e) {
        console.log(e)
    }finally{
        await cliente.close();
    }
}

//actualizarUsuario()

async function eliminarUsuario(){
    const cliente = new MongoClient(uri);
    try {
        await cliente.connect();
        const resultado = await cliente.db('BookWare').collection('usuarios').deleteOne({
            "idUsuario": 4116
        })
        if (resultado){
            console.log(`se ha eliminado el usuario correctamente`);
        }else{
            console.log(`ha ocurrido un error`);
        }
    } catch (error) {
        console.log(error);
    } finally {
        await cliente.close();
    }
}

//eliminarUsuario()

async function verUsuarios(){
    const cliente = new MongoClient(uri);

    try {
        await cliente.connect();
        const resultado = await cliente.db('BookWare').collection('usuarios').find(
            {},{limit:5}
        ).toArray();
        console.log(resultado);
    } catch (e) {
        console.log(e);
    }finally{
        await cliente.close();
    }
}

//verUsuarios();


async function insertarUsuarios(){
    const cliente = new MongoClient(uri);
    try {
        await cliente.connect();
        const datosFaker  = [];
        const idUsuarios =  [];
        for (let i = 0; i <1000; i++) {
            const sexo = faker.person.sex();
            var nombreUsuario = faker.person.firstName(sexo);
            var apellidoUsuario = faker.person.lastName();
            do{
                var idUsuario = faker.number.int({min:001,max:5000});
             }while(idUsuarios.includes(idUsuario));
             idUsuarios.push(idUsuario);
            
            const datosAInsertar = {
                idUsuario:idUsuario,
                numeroDocumento : faker.number.int({min:10000, max:569999}),
                nombreUsuario : nombreUsuario,
                apellidoUsuario : apellidoUsuario,
                passwordUsuario : faker.internet.password(),
                idRol : faker.number.int({min:01, max:03}),
                correoUsuario : faker.internet.email({firstName:nombreUsuario,lastName:apellidoUsuario})
              
                //correoUsuario : faker.internet.email({nombreUsuario,apellidoUsuario})
            }
            datosFaker.push(datosAInsertar);
            console.log(`se han creado: ${i} registros`);
        }
         console.log('estos son los valores que genero el faker');
        console.log(datosFaker);
        const resultado  = await cliente.db('BookWare').collection('usuarios').insertMany(datosFaker)
        if (resultado){
            console.log("se han insertado  registros");
        }else{
            console.log("has fallado");
        }
    } catch (e) {
        console.log(e)
    }finally{
        await cliente.close();
    }
}
//insertarUsuarios();

function insertarUsuario(){
    
}



async function insertarRoles(){
    const cliente  = new MongoClient(uri);

    try {
        await cliente.connect();
        const resultado = await cliente.db('BookWare').collection('roles').insertMany([
            {
                idRol: 1,
                nombreRol : "ADMINISTRADOR",
                estadoRol : "ACTIVO"
            },
            {
                idRol : 2,
                nombreRol : "USUARIO",
                estadoRol: "ACTIVO"
            },
            {
                idRol : 3,
                nombreRol : "PRUEBAS",
                estadoRol : "INACTIVO"
            }
        ]);
        if (resultado){
            console.log("exito al ingresar los datos");
        }else{
            console.log("no se cargaron los documentos a la coleccion")
        }
    } catch (error) {
        console.log(error);
    }finally{
        await cliente.close();
    }
}
//insertarRoles();



//creacion base de datos con coleccion incluida y esquema

async function crearBasedeDatos(){
    const cliente = new MongoClient(uri);

    try{
        await cliente.connect();
        const result = await cliente.db('BookWare').createCollection("usuarios",{
            validator:{
                $jsonSchema:{
                    bsonType: 'object',
                    title:'validacionUsuarios',
                    required:['idUsuario','numeroDocumento','nombreUsuario','apellidoUsuario','passwordUsuario','idRol','correoUsuario'],
                    properties:{
                        idUsuario:{
                            bsonType:'int'
                        },
                        numeroDocumento :{
                            bsonType: 'int'
                        },
                        nombreUsuario:{
                            bsonType: "string"
                        },
                        apellidoUsuario : {
                            bsonType: "string"
                        },
                        passwordUsuario : {
                            bsonType: "string"
                        },
                        idRol : {
                            bsonType: "int"
                        },
                        correoUsuario :{
                            bsonType: "string"
                        }
                    }
                }
            }
        })
        if (result){
            console.log("base de datos creada correctamente");
        }else{
            console.log("no se ha creado");
        }
    }catch(e){
        console.log(e);
    }finally{
        await cliente.close();
    }
}
//crearBasedeDatos();



//funcion para crear coleccion roles

async function crearColeccionRoles() {

    const cliente  = new MongoClient(uri);
    try {
        await cliente.connect();
        const resultado = await cliente.db('BookWare').createCollection("roles",{
            validator:{
                $jsonSchema:{
                    bsonType:'object',
                    title: 'esquemaRoles',
                    required:['idRol','nombreRol','estadoRol'],
                    properties:{
                        idRol:{
                            bsonType:'int'
                        },
                        nombreRol:{
                            bsonType:'string'
                        },
                        estadoRol:{
                            bsonType:'string'
                        }
                    }
                }
            }

        })
        if (resultado){
            console.log("coleccion con esquema creada correctamente")
        }else{
            console.log("no se creo la coleccion")

        }
    } catch (e) {
        console.log(e);
    }finally{
        await cliente.close()
    }
    
}
//crearColeccionRoles();


//funcion buscar por parametro

async function buscarPropiedad(nombrePropiedad) {

    const cliente = new MongoClient(uri);
    console.log("mera vuelta");
    try{
        console.log("entre al try");
        await cliente.connect();
        console.log("ya hize la conexion");
        const result = await cliente.db("sample_airbnb").collection("listingsAndReviews").findOne({
            name:nombrePropiedad
        });
        
        if (result){
            console.log(`se encontro una propiedad con el nombre: ${nombrePropiedad}`);
            console.log(result);
        }else{
            console.log(`no se ha encontrado la propiedad: ${nombrePropiedad}`);
        }
    }catch(e){
        console.log(e);
        console.log("jmm tan raro");
    }finally{
        await cliente.close();
        console.log("ya cerre la conexion");
    }
}

// buscarPropiedad("Ótimo Apto proximo Parque Olimpico")

