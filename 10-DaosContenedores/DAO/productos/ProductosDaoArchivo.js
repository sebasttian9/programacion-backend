import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor(){
        super('db/productos.txt')
    }

    async desconectar(){

    }

    
}


export default ProductosDaoArchivo;