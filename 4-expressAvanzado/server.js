//importaar
const { Router } = require('express');
const express = require('express');
const { isNull } = require('util');
const Contenedor = require('./contenedor');

// inicializar 
const app = express();
const router = Router();
const PORT = 8080;
const cont = new Contenedor('productos.txt');

// configurar 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// se escucha por el puerto asignado 
const server = app.listen(PORT, ()=>{
        console.log("escuchando en puerto "+server.address().port);
})
server.on('error',error => console.log(error));



router.get('',(req,res)=>{

        // const { operacion } = req.params;
        cont.getAll().then(resp =>{
            // res.json(JSON.stringify(resp));
            res.json(resp);
        }).catch(error =>{
            res.json({error : 'Error al pedir productos'});
        })

        
});

router.get('/:id',(req,res)=>{

    const id = parseInt(req.params.id);

    cont.getById(id).then(resp =>{
        // res.json(JSON.stringify(resp));
        if(isNull(resp)){
            res.json({error: 'Producto no encontrado'});
        }else{
            res.json(resp);
        }
        
    }).catch(error =>{
        res.json({error : 'Error al pedir el producto'+error});
    });

    
});

router.post('',(req,res)=>{

    const objeto = {
                        title : req.body.title,
                        price: req.body.precio,
                        thumbnail: req.body.thumb
                   }

    cont.save(objeto).then(resp=>{

        res.json(resp);

    }).catch(error =>{
        res.json({error : 'Error al guardar producto'+error});
    });
    
});

router.put('/:id',(req,res)=>{

    const id = parseInt(req.params.id);

    const objeto = {
        title : req.body.title,
        price: req.body.precio,
        thumbnail: req.body.thumb,
        id : id
   }

    cont.updateById(objeto).then(resp => {

        if(resp==1){
            res.json({ res : 'ok Update'});
        }else{
            res.json({ res : 'No Existe el producto'});            
        }
   

    }).catch(error =>{
       throw new error({'error': 'Error al eliminar'+error});
    })

    
});


router.delete('/:id',(req,res)=>{

    const id = req.params.id;

    cont.deleteById(id).then(resp =>{

        if(resp == 1){
            res.json({ respuesta : 'ok delete'});
        }else{
            res.json({ respuesta : 'Producto no existe!'});
        }
    }).catch(error =>{
        throw new error({'error': 'Error al eliminar'+error});
    });
});

app.use('/api/productos',router);