const express = require('express');
const app = express();
const Contenedor = require('./contenedor');


// iniciar
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const cont = new Contenedor('productos.txt');


app.set('views', './views');
app.set('view engine', 'pug');



app.get('/', (req,res)=>{

    res.render('formulario', {titulo : 'Ingreso Datos'})
});

app.get('/productos', (req,res)=>{

    // const { operacion } = req.params;
    cont.getAll().then(resp =>{
    // res.json(JSON.stringify(resp));
            console.log(resp);
            
            // let productos = JSON.stringify(resp);
            // console.log(productos);
            // res.json(resp);
            res.render('productos', {titulo : 'Vista productos', productos : resp });
    }).catch(error =>{
            res.json({error : 'Error al pedir productos'});
    })

    
});

app.post('/productos', (req,res)=>{

    const objeto = {
        title : req.body.title,
        price: req.body.price,
        thumbnail: req.body.thum
   }

        cont.save(objeto).then(resp=>{

        // res.json(resp);
        res.redirect('/');

        }).catch(error =>{
        res.json({error : 'Error al guardar producto'+error});
        });

});


app.use(express.static('public'));
const PORT = 8080;
const server = app.listen(PORT, (error)=>{

        if(error) throw new Error(error);
        console.log(`Escuchando en puerto `+server.address().port);
});