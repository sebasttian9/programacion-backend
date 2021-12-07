//importaar
import express  from "express";
import { routerCarrito } from "./routers/carritoRouter.js";
import { productosRouter  } from "./routers/productosRouter.js";
// import Contenedor from "./contenedores/contenedorArchivo.js";
// import ContenedorCarrito from "./contenedores/contenedorCarrito.js";
// const { Router } = require('express');
// const express = require('express');
// const { isNull } = require('util');
// const Contenedor = require('./contenedores/contenedor');
// const ContenedorCarrito = require('./contenedores/contenedorCarrito');

// inicializar 
const app = express();
// const contCarrito = new ContenedorCarrito('carrito.txt');


// configurar 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/productos',productosRouter);
app.use('/api/carrito',routerCarrito);





// router.get('',(req,res)=>{

//         // const { operacion } = req.params;
//         cont.getAll().then(resp =>{
//             // res.json(JSON.stringify(resp));
//             res.json(resp);
//         }).catch(error =>{
//             res.json({error : 'Error al pedir productos'});
//         })

        
// });



export default app;