const Conexion = require('./Conexion');

class Roles extends Conexion{
    constructor (uri){
        super(uri);
    }

    async insertarRol(idRol,nombreRol,estadoRol){
        
        // const cliente  = new MongoClient(uri);
        
    
        try {
            // await cliente.connect();
            const cliente = await this.conectar();
            const resultado = await cliente.db('BookWare').collection('roles').insertOne(
                {
                    idRol: idRol,
                    nombreRol : nombreRol,
                    estadoRol: estadoRol
                },
            );
            if (resultado){
                console.log("exito al ingresar los datos");
            }else{
                console.log("no se cargaron los documentos a la coleccion")
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    async verRoles(){
        const conexion =  await this.conectar();
        const resultado = await conexion.db('BookWare').collection('roles').find({},{limit:5}).toArray();
        console.log(JSON.stringify(resultado,null,2));
        //console.log(resultado);
    }

    async  buscarRol(idRol) {

        try{
            const conexion = await this.conectar();
            const resultado = await conexion.db("BookWare").collection("roles").findOne({
                idRol:idRol
            });
            
            if (resultado){
                console.log(resultado);
            }else{
                console.log(`no se han encontrado docuemntos con la propiedad: ${idRol}`);
            }
        }catch(e){
            console.log(e);
        }
    }

    async eliminarRol(idRol){
        
        try {
            const conexion  = await this.conectar();
            const resultado = await conexion.db('BookWare').collection('roles').deleteOne({
                idRol: idRol
            })
            if (resultado){
                console.log(`se ha eliminado el rol correctamente`);
            }
        } catch (error) {
            console.log(error);
        } 
    } 

    actualizarRol  = async(idRol,estadoRol)  =>{
        const conexion = await this.conectar();
        try {
   
            const resultado = await conexion.db('BookWare').collection('roles').updateOne({
                idRol:idRol
            },{$set:{estadoRol:estadoRol}});
            if (resultado){
                console.log("se ha actualizado el Rol");
            }
        } catch (e) {
            console.log(e)
        }
    }

    async  crearColeccionRoles() {

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
}

module.exports  = Roles;