const Conexion  = require('./Conexion');

class Prestamos{

    constructor(uri){
        this.conexion  = new Conexion(uri)
    }




    async insertarPrestamo(datosPrestamo){
      const conexion = await this.conectar();
      console.log("tenemos la conexion");
      try {
          if (!Array.isArray(datosPrestamo)){
              await conexion.db('BookWare').collection('prestamos').insertOne(datosPrestamo)
          }else{
              await conexion.db('BookWare').collection('prestamos').insertMany(datosPrestamo)
          }
          console.log("se han insertado los registros a la base de datos")
      } catch (error) {
          console.log("error al registrar el documento",error)
      }
    }

    async verPrestamos(){
        const cliente  = await this.conexion.conectar();
        try {
         
            // const resultado = await cliente.db('BookWare').collection('prestamos').find({},{limit:5}).toArray();
            const resultado = await cliente.db('BookWare').collection('prestamos').aggregate([
              {
                $lookup:{
                  from:'peticiones',
                  localField:'idPeticion',
                  foreignField:'idPeticion',
                  as: 'peticion'
                },
              },{$limit:5}
            ])
            if (resultado){
                console.log(resultado);
            }else{
                console.log("no hay registros en la coleccion prestamos")
            }
     
        } catch (e) {
            console.log(e);
        }
    }

    async buscarPrestamo(idPrestamo) {
        const cliente = await this.conexion.conectar();

        try {
            const resultado = await cliente.db('BoowWare').collection('prestamos').findOne({
                idPrestamo:idPrestamo
            })
            if (resultado){
                console.log(resultado);
            } else{
              console.log('no se enconstraron prestamos con este id');
            }  

        } catch (error) {
            console.log(e)
        }
    }

    async eliminarPrestamo(idPrestamo){
        const cliente = await this.conexion.conectar();

        try {
            const resultado = await cliente.db('BoowWare').collection('prestamos').deleteOne({
                idPrestamo:idPrestamo
            })
            if (resultado){
                console.log("se ha eliminado el prestamo");
            }   

        } catch (error) {
            console.log(e)
        }
    }

    async modificarPrestamo(){
        
    }

}

module.exports = Prestamos;