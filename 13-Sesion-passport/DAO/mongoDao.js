const mongoose = require('mongoose');
// import config from "../config.js";
const config = require("../config.js");

mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {

        constructor(nombreColeccion, esquema){
            this.coleccion = mongoose.model(nombreColeccion,esquema);
        //     console.log(this.coleccion.insertMany({title:"seba",price:1200, thumb:"prueba"}))
        }


        async getAll(){

                let cole = this.coleccion;
                // console.log(cole.find({}));

                let result =  await cole.find({});
                console.log(result);
                return result;
        }

        async save(objeto){

                let result = await this.coleccion.create(objeto);

                return result;
        }


        async getById(id){


                let result = await this.coleccion.find({"_id": id});

                return result;

        }

        async login(nombre){


                let result = await this.coleccion.find({"nombre": nombre});

                return result;

        }

        async login2(nombre){


                let result = await this.coleccion.findOne({"nombre": nombre});

                return result;

        }

}

// export default ContenedorMongoDb;
module.exports = ContenedorMongoDb
