const knex = require('knex');

class Mensajes {
    constructor(config){
        this.knex = knex(config);
    }

    crearTabla(){
        return this.knex.schema.dropTableIfExists('mensajes')
            .then(()=>{
                return this.knex.schema.createTable('mensajes', table =>{
                    table.increments("id").primary();
                    table.string("email",100).notNullable();
                    table.string("fecha",100).notNullable();
                    table.string("mensaje",255)
                })
            }).catch((e)=>{
                console.log(e);
            }).finally(()=>{
                this.knex.destroy();
            })
            
    }

    insertarMensaje(mensaje){
        return this.knex("mensajes").insert(mensaje)
    }


    selectMensajes(){

        return this.knex.from("mensajes").select("email","fecha","mensaje").orderBy("id","asc");
            // .then((row)=>{
            //     return row;
            // }).catch((err) => { console.log(err); throw err})
            // .finally(()=>{
            //     this.knex.destroy();
            // });
    }




    cerrarDB(){
        return this.knex.destroy();
    }
}

// export default Mensajes;

module.exports = {
    Mensajes
}