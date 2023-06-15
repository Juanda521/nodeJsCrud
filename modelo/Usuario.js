const {faker} = require ('@faker-js/faker');
const Conexion = require('./Conexion');



 class Usuario extends Conexion{

    constructor(uri){
        super(uri);
        //console.log("estamos en la clase")
    }

    insertarUsuario = async(datosUsuario) =>{

        const conexion = await this.conectar();
        console.log("tenemos la conexion");
        try {
            if (!Array.isArray(datosUsuario)){
                await conexion.db('BookWare').collection('usuarios').insertOne(datosUsuario)
            }else{
                await conexion.db('BookWare').collection('usuarios').insertMany(datosUsuario)
            }
            console.log("se han insertado los registros a la base de datos")
        } catch (error) {
            console.log("error al registrar el documento",error)
        }
        
    }

    async verUsuarios(){
       
        const conexion = await this.conectar();
        console.log("tenemos la conexion");
        try {
            const resultado = await conexion.db('BookWare').collection('usuarios').aggregate([
                {
                    $lookup:{
                        from:'roles',
                        localField:'idRol',
                        foreignField:'idRol',
                        as: 'rol'
                    },
                },  {$limit:5},
                {$sort:{idUsuario:1}}
            ]).toArray();
            console.log(resultado);
        } catch (e) {
            console.log(e);
        }
    }

    async  buscarUsuario(idUsuario) {

        try{
            const conexion = await this.conectar();
            const resultado = await conexion.db("BookWare").collection("usuarios").findOne({
                idUsuario:idUsuario
            });
            
            if (resultado){
                console.log(resultado);
            }else{
                console.log(`no se han encontrado docuemntos con la propiedad: ${idUsuario}`);
            }
        }catch(e){
            console.log(e);
        }
    }

    async obteneridUsuarios(){
        try {
            const conexion  = await this.conectar();
            const resultado = await conexion.db('BookWare').collection('usuarios').aggregate([{
                $project:{
                    _id:0,idUsuario:1
                }
            }]).toArray();
            //console.log(resultado)
            return resultado;
        } catch (e) {
            console.log(e)
        }
    }

    
    async eliminarUsuario(idUsuario){
        
        try {
            const conexion  = await this.conectar();
            const resultado = await conexion.db('BookWare').collection('usuarios').deleteOne({
                idUsuario: idUsuario
            })
            if (resultado){
                console.log(`se ha eliminado el usuario correctamente`);
            }
        } catch (error) {
            console.log(error);
        } 
    }

    actualizarUsuario  = async(nombreUsuario,idUsuario)  =>{
        const conexion = await this.conectar();
        try {
   
            const resultado = await conexion.db('BookWare').collection('usuarios').updateOne({
                idUsuario:idUsuario
            },{$set:{nombreUsuario:nombreUsuario}});
            if (resultado){
                console.log("se ha actualizado el usuario");
            }
        } catch (e) {
            console.log(e)
        }
    }

    //creacion base de datos con coleccion incluida y esquema

    async  crearBasedeDatos(){
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
        }
    }

    eliminarColeccion = async() =>{

        const cliente  = new MongoClient(uri);
        try {
            await cliente.connect();
            const resultado = await cliente.db('BookWare').collection('').drop();
            if (resultado){
                console.log("se ha eliminado la coleccion");
            }
        } catch (e) {
            console.log(e)
        }finally{
            await cliente.close();
        }
    }



}

module.exports = Usuario;


 
  

