import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";


class CarritoDaoArchivo extends ContenedorArchivo {

    constructor(rutaDir){
        super(`${rutaDir}/carrito.txt`);
    }


    async desconectar(){

    }
}


export default CarritoDaoArchivo;