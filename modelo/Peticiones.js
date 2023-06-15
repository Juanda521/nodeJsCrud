const Conexion = require('./Conexion');


class Peticiones extends Conexion{
    constructor(uri){
        super(uri)
    }

    

    async insertarPeticion (datosPeticion){ 
        const conexion  = await this.conectar();
        //console.log("tenemos conexion a la bd");
        try {

            if (!Array.isArray(datosPeticion)){
                await conexion.db('BookWare').collection('peticiones').insertOne(datosPeticion)
                console.log("se han insertado los documentos en la base de datos")
            }else{
                await conexion.db('BookWare').collection('peticiones').insertMany(datosPeticion)
                console.log("se han insertado los documentos en la base de datos")
            }
           
        } catch (e) {
           console.log(e) 
        } 
    }

    async verPeticiones(){
        const conexion =  await this.conectar();
        const resultado = await conexion.db('BookWare').collection('peticiones').aggregate([
            { 
                $lookup:{
                from:'usuarios',
                localField:'idUsuario',
                foreignField:'idUsuario',
                as: 'usuario'
                }
            },
            {
                $lookup:{
                from:'Libros',
                localField:'idLibro',
                foreignField:'idLibro',
                as: 'Libro'
                }
            },{
                $sort:{'idPeticion':-1}
            }

        ]).limit(5).toArray();
        console.log(JSON.stringify(resultado,null,2));
        //console.log(resultado);
    }

    async buscarPeticion(idPeticion){
        try {
            const conexion  = await this.conectar();
            const resultado =  await conexion.db('BookWare').collection('peticiones').aggregate([{
                $match:{
                   idPeticion:idPeticion
                }
            },{
                $lookup:{
                    from:'Libros',
                    localField:'idLibro',
                    foreignField:'idLibro',
                    as: 'libros'
                }
            },{
                $lookup:{
                    from:'usuarios',
                    localField:'idUsuario',
                    foreignField:'idUsuario',
                    as: 'usuarios'
                }
            }
        ]).toArray()
            console.log(JSON.stringify(resultado,null,2));
        } catch (e) {
            console.log(e);
        }
       
    }

    async eliminarPeticion(idPeticion){
        try {
            const conexion  = await this.conectar();
            const resultado  = await conexion.db('BookWare').collection('peticiones').deleteOne({
                idPeticion:idPeticion
            })
            if(resultado){
                console.log("la peticion se ha eliminado correctamente")
            }
        } catch (e) {
            console.log(e)
        }
       
    }
}
module.exports = Peticiones;



    
