// Import
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const fs = require('fs');

// Inicializar
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer); // servidor de socket

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));


const productos = []
const mensajes = []


// 

// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de personas
    socket.emit('productos', productos);

    // carga inicial de personas
    socket.emit('chat', mensajes);    


    // actualizacion de personas
    socket.on('update', producto => {
        productos.push(producto)
        io.sockets.emit('productos', productos);
    })

    // Chat
    socket.on('chat', mensaje => {
        mensajes.push(mensaje)
        try {

            fs.writeFileSync('mensajes.txt',JSON.stringify(mensajes,null,2));
            
        } catch (error) {
            
            console.log('error '+error);
        }
        io.sockets.emit('chat', mensajes);
    })
});

httpServer.listen(8081, ()=> console.log('SERVER ON'))
httpServer.on('error', (error)=>{})