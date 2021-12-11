// Import
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const fs = require('fs');
const { Mensajes } = require('./contenedorMensajes');
const { Productos } = require('./contenedorProductos');
const { sqlite3:optionsLite } = require('./conexion/sqlite3');
const { mysql:options } = require('./conexion/mysql');


// Inicializar
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer); // servidor de socket
const contenedorMensajesIns = new Mensajes(optionsLite);
const contenedorProductos = new Productos(options);

// contenedorMensajesIns.crearTabla().then(()=> console.log('Tabla mensajes creada'));
// contenedorProductos.crearTabla().then(()=> console.log('Tabla mensajes creada Mysql'));



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));


// const productos = []
// const mensajes = []


// 

// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de personas
    contenedorProductos.selectProductos().then((row)=>{
        // console.log(JSON.stringify(row));
        socket.emit('productos', JSON.stringify(row));
    })
    

    // carga inicial de personas
    // socket.emit('chat', mensajes);
    contenedorMensajesIns.selectMensajes().then((row)=>{
        // console.log(row);
        // mensajes  = row;
        socket.emit('chat', row);
    })        


    // actualizacion de productos
    socket.on('update', producto => {
        console.log(producto);

        contenedorProductos.insertarProductos(producto).then(()=>{
            console.log('insertado producto');

            contenedorProductos.selectProductos().then((row)=>{
                console.log(row);
                io.sockets.emit('productos', JSON.stringify(row));
            })
        })
        .catch((e)=>{
                console.log(e);
        })
        .finally(()=>{
            contenedorProductos.cerrarDB();
        });
        // productos.push(producto)

        
    })

    // Chat
    socket.on('chat', mensaje => {
        // mensajes.push(mensaje);
        // Insertar mensajes en sqllite3
        contenedorMensajesIns.insertarMensaje(mensaje).then(()=>{
            console.log('insertado mensaje');
        })
        .catch((e)=>{
                console.log(e);
        })
        .finally(()=>{
            contenedorMensajesIns.cerrarDB();
        });


        // try {

        //     fs.writeFileSync('mensajes.txt',JSON.stringify(mensajes,null,2));
            
        // } catch (error) {
            
        //     console.log('error '+error);
        // }
        // const mensajes = [];
        contenedorMensajesIns.selectMensajes().then((row)=>{
            // console.log(row);
            // mensajes  = row;
            io.sockets.emit('chat', row);
        })
        
    })
});

httpServer.listen(8081, ()=> console.log('SERVER ON'))
httpServer.on('error', (error)=>{})