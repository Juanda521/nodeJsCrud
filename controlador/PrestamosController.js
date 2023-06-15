const Prestamos = require('../modelo/Prestamos.js');

class PrestamosController{

    constructor(uri){
        this.Prestamos = new Prestamos(uri);
    }


    async insertarPrestamo(datosPrestamo){
        await this.Prestamos.insertarPrestamo(datosPrestamo);
    }

    async verPrestamos(){
        await this.Prestamos.verPrestamos();
    }

    async buscarPrestamo(idPrestamo){
        await this.Prestamos.buscarPrestamo(idPrestamo);
    }
}

module.exports  = PrestamosController;

