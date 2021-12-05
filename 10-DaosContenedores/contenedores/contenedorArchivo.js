import fs from "fs";
// import fs from 'fs';
class ContenedorArchivo {

    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
        console.log('this: ',this);
    }

    async save(objeto){

            // Recibir un objeto
            // validar el id del objeto
            // guardarlo en el archivo
            // devolver el id asignado

                try {

                    
                    if (fs.existsSync(this.nombreArchivo)) {
                        //file exists
                        const data = await fs.promises.readFile(this.nombreArchivo,'utf-8');
                        const obj = JSON.parse(data);
                        
                        // console.log(typeof(obj));
                        // let productos = data;
                        let productos = [];
                        let id = 0;
                        obj.map((p)=>{
                            // console.log(p);
                            productos.push(p);
                            id = p.id;
                        });
                        
                        objeto.id = id+1;
                        productos.push(objeto);
                        // console.log(id);   
                        await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(productos,null,2));
                        // console.log('id asignado: '+(id+1));
                        return objeto;
                    }else{
                        // let id = 1;
                        objeto.id = 1;
                        let productos = [];
                        productos.push(objeto);
                        console.log('no existe el archivo');
                        await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(productos,null,2));
                        // console.log('id asignado: 1');
                        return objeto;
                    }

                    
                } catch (error) {
                    console.log(error);
                }
                
            

            
    }


    async getById(id){

        try {

            const data = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            const obj = JSON.parse(data);
            
            const result = obj.filter(p => p.id == id);
            if(result.length<1){
                // console.log(null);
                return null;
            }else{
                // console.log(result[0]);
                return result[0];
            }
            
        } catch (error) {
             throw new Error({'error':'error al buscar producto'});
        }

    }


    async getAll(){

        try {

            const data = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            const obj = JSON.parse(data);
            
            // console.log(typeof(obj));
            // let productos = data;
            let productos = [];
            // let id = 0;
            obj.map((p)=>{
                // console.log(p);
                productos.push(p);
                // id = p.id;
            });     
            
            // console.log(productos);
            return productos;
            
        } catch (error) {
            
            console.log(error);
        }
    }


    async deleteById(id) {

        try {

            const data = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            const obj = JSON.parse(data);
            
            const indice = obj.findIndex((p) => p.id == id);
            // console.log(indice);
            // let indice = obj.findIndex(result);
            // console.log(indice);
            if(indice>=0){
                obj.splice(indice,1);
                await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(obj,null,2));
                // console.log('eliminado');
                return 1;                
            }else{
                // console.log('no existe');
                return 0;
            }
            

            // console.log('eliminado '+result);
            
        } catch (error) {

            console.log(error);
            
        }
    }


    async deleteAll(){

        try {

            let productos = [];
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(productos,null,2));
            console.log('array vacio');            
            
        } catch (error) {
            
            console.log(error);
        }
    }




    // Actualizar objeto
    async updateById(objeto) {

        try {

            const data = await fs.promises.readFile(this.nombreArchivo,'utf-8');
            const obj = JSON.parse(data);
            
            const indice = obj.findIndex((p) => p.id == objeto.id);
            // console.log(indice);
            // let indice = obj.findIndex(result);
            // console.log(indice);
            if(indice>=0){
                // obj.splice(indice,1);
                obj[indice].title = objeto.title;
                obj[indice].price = objeto.price;
                obj[indice].thumbnail = objeto.thumbnail;

                await fs.promises.writeFile(this.nombreArchivo,JSON.stringify(obj,null,2));
                // console.log('eliminado');
                return 1;                
            }else{
                // console.log('no existe');
                return 0;
            }
            

            // console.log('eliminado '+result);
            
        } catch (error) {

            console.log(error);
            
        }
    }    
}

// module.exports = Contenedor;

export default ContenedorArchivo;