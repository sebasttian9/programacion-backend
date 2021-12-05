
import { Router } from "express";
import CarritoDaoArchivo from "../DAO/carrito/CarritoDaoArchivo.js";

const routerCarrito = Router();
const carroDaoArchivo = new CarritoDaoArchivo();

/// RUTAS CARRITO ///////////////////////////////////////////////////////////////////////////////////////////////

routerCarrito.get('/:id/productos',(req,res)=>{

    const id = req.params.id;
    // const { operacion } = req.params;
    carroDaoArchivo.getAll(id).then(resp =>{
        // res.json(JSON.stringify(resp));
        if(resp){
            res.json(resp);
        }else{
            res.json({error: 'No existe carro'});
        }
        
    }).catch(error =>{
        res.json({error : 'Error al pedir productos del carrito '+id});
    })

    
});

routerCarrito.post('/:id/productos/:id_prod',(req,res)=>{

const id = req.params.id;
const id_prod = req.params.id_prod;
// const { operacion } = req.params;
carroDaoArchivo.saveProd(id,id_prod).then(resp =>{
    // res.json(JSON.stringify(resp));
    if(resp){
        res.json(resp);
    }else{
        res.json({error: 'No existe carro'});
    }
    
}).catch(error =>{
    res.json({error : 'Error al pedir productos del carrito '+id});
})


});


routerCarrito.post('',(req,res)=>{

const carrito = {
                    timestamp: Date.now(),
                    productos: []
               }

    carroDaoArchivo.save(carrito).then(resp=>{

    res.json(resp);

}).catch(error =>{
    res.json({error : 'Error al guardar producto'+error});
});

});



routerCarrito.delete('/:id',(req,res)=>{

const id = req.params.id;

carroDaoArchivo.deleteById(id).then(resp =>{

    if(resp == 1){
        res.json({ respuesta : 'ok delete'});
    }else{
        res.json({ respuesta : 'Carrito no existe!'});
    }
}).catch(error =>{
    throw new error({'error': 'Error al eliminar'+error});
});
});


routerCarrito.delete('/:id/productos/:id_prod',(req,res)=>{

const id = req.params.id;
const id_prod = req.params.id_prod;

carroDaoArchivo.deleteByIdProdCarro(id,id_prod).then(resp =>{

    if(resp == 1){
        res.json({ respuesta : 'ok delete'});
    }else{
        res.json({ respuesta : 'Carrito no existe!'});
    }
}).catch(error =>{
    throw new error({'error': 'Error al eliminar'+error});
});
});


export { routerCarrito }