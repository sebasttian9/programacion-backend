const ContenedorMongoDb = require("../DAO/mongoDao.js");

class ProductosDtoMongo extends ContenedorMongoDb {


        constructor(){
            super('usuarios', {
                nombre: { type: String, required: true },
                password: { type: String, required: true },
            });
        }

}

// export default ProductosDaoMongo

module.exports = ProductosDtoMongo
