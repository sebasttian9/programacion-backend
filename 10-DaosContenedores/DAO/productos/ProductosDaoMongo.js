import ContenedorMongoDb  from "../../contenedores/contenedorMongo.js"

class ProductosDaoMongo extends ContenedorMongoDb {


        constructor(){
            super('productos', {
                title: { type: String, required: true },
                precio: { type: Number, required: true },
                thumb: { type: String, required: true },
            });
        }

}

export default ProductosDaoMongo