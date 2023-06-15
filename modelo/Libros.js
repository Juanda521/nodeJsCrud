const {faker} = require ('@faker-js/faker');
const Conexion = require('./Conexion');



 class Libros extends Conexion{

    constructor(uri){
        super(uri);
        //console.log("estamos en la clase")
    }

    insertarLibro = async(datosLibro) =>{

        const conexion = await this.conectar();
        //console.log("tenemos la conexion");
        try {
            if (!Array.isArray(datosLibro)){
                await conexion.db('BookWare').collection('Libros').insertOne(datosLibro)
            }else{
                await conexion.db('BookWare').collection('Libros').insertMany(datosLibro)
            }
            console.log("se han insertado los registros a la base de datos")
        } catch (error) {
            console.log("error al registrar el documento",error)
        }
        
    }

    async verLibros(){
       
        const conexion = await this.conectar();
        console.log("tenemos la conexion");
        try {
            const resultado = await conexion.db('BookWare').collection('Libros').aggregate([
                {
                $project:{_id:0}
                },
                {$sort:{idLibro:1}}
            ]).limit(5).toArray();
            console.log(resultado);
        } catch (e) {
            console.log(e);
        }
    }

    async  buscarLibro(idLibro) {

        try{
            const conexion = await this.conectar();
            const resultado = await conexion.db("BookWare").collection("Libro").findOne({
                idLibro:idLibro
            });
            
            if (resultado){
                console.log(resultado);
            }else{
                console.log(`no se han encontrado docuemntos con la propiedad: ${idLibro}`);
            }
        }catch(e){
            console.log(e);
        }
    }

    async obteneridLibros(){
        try {
            const conexion  = await this.conectar();
            const resultado = await conexion.db('BookWare').collection('Libros').aggregate([{
                $project:{
                    _id:0,idLibro:1
                }
            }]).toArray();
            //console.log(resultado)
            return resultado;
        } catch (e) {
            console.log(e)
        }
    }

    
    async eliminarLibro(idLibro){
        
        try {
            const conexion  = await this.conectar();
            const resultado = await conexion.db('BookWare').collection('Libros').deleteOne({
                idLibro: idLibro
            })
            if (resultado){
                console.log(`se ha eliminado el libro exitosamente`);
            }
        } catch (error) {
            console.log(error);
        } 
    }

    async actualizarLibro(nombreLibro,idLibro){
        const conexion = await this.conectar();
        try {
   
            const resultado = await conexion.db('BookWare').collection('Libros').updateOne({
                idLibro:idLibro
            },{$set:{NombreLibro:nombreLibro}});
            if (resultado){
                console.log("se ha actualizado el libro exitosamente");
            }
        } catch (e) {
            console.log(e)
        }
    }




}

module.exports = Libros;


 
  

