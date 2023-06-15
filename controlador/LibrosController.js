const Libros  = require('../modelo/Libros.js');



class LibrosController{

    constructor(uri){
        this.Libro = new Libros(uri)
    
    }
    
 

   async verLibros(){
    await this.Libro.verLibros()
   }

   async actualizarLibro(nombreLibro,idLibro){
    await this.Libro.actualizarLibro(nombreLibro,idLibro)
   }

   async buscarLibro(idLibro){
    await this.Libro.buscarLibro(idLibro)
   }

   async eliminarLibro(idLibro){
    await this.Libro.eliminarLibro(idLibro)
   }

   async obteneridLibros(){
    const idLibros = await this.Libro.obteneridLibros();
    return idLibros
   }
}
module.exports = LibrosController;

