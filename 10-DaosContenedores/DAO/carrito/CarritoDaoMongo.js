import ContenedorMongoDb from "../../contenedores/contenedorMongo.js"
import mongoose from "mongoose";

class CarritoDaoMongo extends ContenedorMongoDb {


        constructor(){
            super('carritos', {
                timestamp: { type: String, required: true },
                productos: [{ id_producto: { type: mongoose.Schema.Types.ObjectId, ref: 'productos' }, cantidad: Number }]
            });
        }

}

export default CarritoDaoMongo;