import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor(rutaDir){
        super(`${rutaDir}/productos.txt`)
    }

    async desconectar(){

    }

    
}


export default ProductosDaoArchivo;