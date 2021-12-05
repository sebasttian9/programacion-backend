import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";


class CarritoDaoArchivo extends ContenedorArchivo {

    constructor(){
        super('db/carrito.txt');
    }


    async desconectar(){

    }
}


export default CarritoDaoArchivo;