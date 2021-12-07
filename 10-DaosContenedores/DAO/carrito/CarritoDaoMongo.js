import ContenedorMongoDb from "../../contenedores/contenedorMongo.js"

class CarritoDaoMongo extends ContenedorMongoDb {


        constructor(){
            super('carritos', {
                title: { type: String, required: true },
                precio: { type: Number, required: true },
                thumb: { type: String, required: true },
            });
        }

}

export default CarritoDaoMongo;