// Import
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const fs = require('fs');
const { Mensajes } = require('./contenedorMensajes');
const { Productos } = require('./contenedorProductos');
const  Contenedor = require('./contenedor');
const { sqlite3:optionsLite } = require('./conexion/sqlite3');
const { mysql:options } = require('./conexion/mysql');
const { generarProductos } = require('./faker/productos');
const { normalize, denormalize, schema } = require("normalizr");
const util = require('util')

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true))
}



// Inicializar
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer); // servidor de socket
const contenedorMensajesIns = new Mensajes(optionsLite);
const contenedorProductos = new Productos(options);
const contenedorMensajes = new Contenedor('mensajes3.txt');

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

    // Carga inicial de mensajes
    contenedorMensajes.getAll().then((row)=>{
        // console.log(row);


        // Inicio proceso de normalizacion
        const mensajes = { id: 'mensajes1', mensajes: row};
        console.log(mensajes);
        // const mensajes = row;

        const autorSchema = new schema.Entity('autor', {}, { idAttribute: "id" });

        const message = new schema.Entity("mensajes", {
            autor: autorSchema
        }); //, { idAttribute: () => "" }
        // const textSchema = new schema.Entity('text');
        // Definimos un esquema de mensaje
        const mensajesSchema = new schema.Entity('chat',{
            mensajes : [message]
        });

        console.log(' ------------- OBJETO NORMALIZADO --------------- ')
        const normalizedMensajes = normalize(mensajes, mensajesSchema);
        print(normalizedMensajes)


        // console.log(' ------------- OBJETO DESNORMALIZADO --------------- ')
        // const denormalizedHolding = denormalize(normalizedHolding.result, mensajesSchema, normalizedHolding.entities);
        // print(denormalizedHolding)        

        // mensajes  = row;
        socket.emit('chat', normalizedMensajes);
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
        contenedorMensajes.save(mensaje).then(()=>{
            console.log('insertado mensaje');

            contenedorMensajes.getAll().then((row)=>{
                console.log(row);

        // INICIO de proceso de normalizacion
        const mensajes = { id: 'mensajes1', mensajes: row};
        console.log(mensajes);
        // const mensajes = row;

        const autorSchema = new schema.Entity('autor', {}, { idAttribute: "id" });

        const message = new schema.Entity("mensajes", {
            autor: autorSchema
        }); //, { idAttribute: () => "" }
        // const textSchema = new schema.Entity('text');
        // Definimos un esquema de mensaje
        const mensajesSchema = new schema.Entity('chat',{
            mensajes : [message]
        });        
        
        const normalizedMensajes = normalize(mensajes, mensajesSchema);
        // print(normalizedMensajes)        
        /// FIN normalizar mensajes (pasar a funcion externa)

               // mensajes  = row;
               io.sockets.emit('chat', normalizedMensajes);
           })
        })
        .catch((e)=>{
                console.log(e);
        })
        .finally(()=>{
            // contenedorMensajesIns.cerrarDB();
        });


        // try {

        //     fs.writeFileSync('mensajes.txt',JSON.stringify(mensajes,null,2));
            
        // } catch (error) {
            
        //     console.log('error '+error);
        // }
        // const mensajes = [];

        
    })
});

httpServer.listen(8081, ()=> console.log('SERVER ON'))
httpServer.on('error', (error)=>{})

const default_cant_productos = 5;
app.get('/api/productos-test', (req, res)=>{

    res.json(generarProductos(default_cant_productos));
})