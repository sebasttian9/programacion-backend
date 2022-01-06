const knex = require('knex');

class Productos {
    constructor(config){
        this.knex = knex(config);
    }

    crearTabla(){
        return this.knex.schema.dropTableIfExists('productos')
            .then(()=>{
                return this.knex.schema.createTable('productos', table =>{
                    table.increments("id").primary();
                    table.string("titulo",100).notNullable();
                    table.string("precio",100).notNullable();
                    table.string("url",255)
                })
            })
    }


    insertarProductos(mensaje){
        return this.knex("productos").insert(mensaje)
    }


    selectProductos(){

        return this.knex.from("productos").select("titulo","precio","url").orderBy("id","asc");
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
    Productos
}