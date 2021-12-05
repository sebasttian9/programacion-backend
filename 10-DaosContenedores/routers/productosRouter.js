import { Router } from "express";
import ProductosDaoArchivo from "../DAO/productos/ProductosDaoArchivo.js";

const prodDaoArchivo = new ProductosDaoArchivo();
const productosRouter = Router();



//// RUTAS PRODUCTOS

productosRouter.get('/:id?',(req,res)=>{

    if(admin){

    const id = parseInt(req.params.id);
    console.log('id por parametro'+id);
    if(id){

        prodDaoArchivo.getById(id).then(resp =>{
            // res.json(JSON.stringify(resp));
            if(isNull(resp)){
                res.json({error: 'Producto no encontrado'});
            }else{
                res.json(resp);
            }
            
        }).catch(error =>{
            res.json({error : 'Error al pedir el producto'+error});
        });

    }else{

        // const { operacion } = req.params;
        prodDaoArchivo.getAll().then(resp =>{
            // res.json(JSON.stringify(resp));
            res.json(resp);
        }).catch(error =>{
            res.json({error : 'Error al pedir productos'});
            next(err);
        })

    }

    }else{

        res.json({ error : -1, descripcion: 'Metodo GET productos No Autorizado'})
    }

    
});

productosRouter.post('',(req,res)=>{

        if(admin){

            const objeto = {
                                title : req.body.title,
                                price: req.body.precio,
                                thumbnail: req.body.thumb
                        }

                prodDaoArchivo.save(objeto).then(resp=>{

                res.json(resp);

            }).catch(error =>{
                res.json({error : 'Error al guardar producto'+error});
                next(err);
            });

        }else{

            res.json({ error : -1, descripcion: 'Metodo POST Crear producto No Autorizado'})
        }

    
});

productosRouter.put('/:id',(req,res)=>{
    
        if(admin){
            const id = parseInt(req.params.id);

            const objeto = {
                title : req.body.title,
                price: req.body.precio,
                thumbnail: req.body.thumb,
                id : id
        }

        prodDaoArchivo.updateById(objeto).then(resp => {

                if(resp==1){
                    res.json({ res : 'ok Update'});
                }else{
                    res.json({ res : 'No Existe el producto'});            
                }
        

            }).catch(error =>{
            throw new error({'error': 'Error al eliminar'+error});
            next(err);
            })


        }else{

            res.json({ error : -1, descripcion: 'Metodo PUT Actualizar producto No Autorizado'})
        }
    
});


productosRouter.delete('/:id',(req,res)=>{


        if(admin){
            const id = req.params.id;

            prodDaoArchivo.deleteById(id).then(resp =>{

                if(resp == 1){
                    res.json({ respuesta : 'ok delete'});
                }else{
                    res.json({ respuesta : 'Producto no existe!'});
                }
            }).catch(error =>{
                throw new error({'error': 'Error al eliminar'+error});
                next(err);
            });


        }else{

            res.json({ error : -1, descripcion: 'Metodo DELETE producto No Autorizado'})
        }
});




// function handleErrors(err, req, res, next) {
//     console.log(err);
//     res.status(500).send('An internal server error occurred');
//   };
  
// app.use(handleErrors);


export { productosRouter }