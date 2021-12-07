import ContenedorMongoDb  from "../../contenedores/contenedorMongo.js"

class ProductosDaoMongo extends ContenedorMongoDb {


        constructor(){
            super('productos', {
                timestamp: { type: String, required: true },
                productos: { type: Number, required: true },
            });
        }

}

export default ProductosDaoMongo