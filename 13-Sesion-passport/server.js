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
const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const MongoStore = require('connect-mongo');


function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true))
}



// Inicializar
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer); // servidor de socket
const contenedorMensajesIns = new Mensajes(optionsLite);
const contenedorProductos = new Productos(options);
const contenedorMensajes = new Contenedor('mensajes2.txt');


// contenedorMensajesIns.crearTabla().then(()=> console.log('Tabla mensajes creada'));
// contenedorProductos.crearTabla().then(()=> console.log('Tabla mensajes creada Mysql'));


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(session({

    // store: new FileStore({path: './sesiones', ttl:60, retries: 0}),
    store: MongoStore.create({mongoUrl: 'mongodb://localhost/sesiones',ttl: 600 }, ),
    secret: 'secreto',
    resave: false,
    saveUninitialized : false,
    autoRemove: 'interval',
    autoRemoveInterval: 10 /* In minutes. Default,
     cookie: { maxAge: 60000}*/
}));


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
        // const mensajes = { id: 'mensajes1', mensajes: row};
        // const mensajes = row;

        // const autorSchema = new schema.Entity('autor');
        // const textSchema = new schema.Entity('text');
        // Definimos un esquema de mensaje
        // const mensajeSchema = new schema.Entity('mensajes',{
            // autor: autorSchema
        // });

        // console.log(' ------------- OBJETO NORMALIZADO --------------- ')
        // const normalizedHolding = normalize(mensajes, mensajeSchema);
        // print(normalizedHolding)


        // console.log(' ------------- OBJETO DESNORMALIZADO --------------- ')
        // const denormalizedHolding = denormalize(normalizedHolding.result, mensajeSchema, normalizedHolding.entities);
        // print(denormalizedHolding)        

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
        contenedorMensajes.save(mensaje).then(()=>{
            console.log('insertado mensaje');

            contenedorMensajes.getAll().then((row)=>{
                console.log(row);
               // mensajes  = row;
               io.sockets.emit('chat', row);
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

// setear cookie sin tiempo
app.get('/set', (req, res)=>{
    res.cookie('server','express').send('cookie set');
})

// setear cookie con 30 segundos se vida
app.get('/setEX', (req, res)=>{
    res.cookie('server2','express', { maxAge: 30000}).send('cookie setEX');
})

// obtener valor de cookie por el nombre
app.get('/get', (req, res)=>{
    res.send(req.cookies.server);
})


// borrar una cookie por el nombre
app.get('/clr', (req, res)=>{
    res.clearCookie('server').send('cookie clear');
})


// borrar una cookie por el nombre
app.get('/cookies', (req, res)=>{
    res.json({normales : req.cookies, firmadas: req.signedCookies});
})

// borrar una cookie por el nombre
app.post('/cookies', (req, res)=>{

    let nombre = req.body.nombre;
    let valor = req.body.valor;
    let tiempo = req.body.tiempo;

    console.log(nombre, valor, tiempo);

    if(!nombre || !valor){
        res.send({error: 'Falta nombre o valor'});
        return
    }

    if(!tiempo){
        res.cookie(nombre,valor, { signed : true}).send(`cookie1 ${nombre} creada`);
    }else{
        res.cookie(nombre,valor, { signed: true, maxAge: 1000 * parseInt(tiempo) }).send(`cookie2 ${nombre} creada`);
    }

    
})


// borrar una cookie por el nombre
app.delete('/coockie/:name', (req, res)=>{
    let nombre = req.params.name;

    res.clearCookie(nombre).send('cookie'+nombre+' Eliminada');
})




// SESSIONES 

app.get('/root',(req,res)=>{

    let nombre = req.query.nombre;

    if(req.session.contador){

        req.session.contador++;

        if(nombre){

            res.send({mensaje: nombre+' visitado la pagina '+req.session.contador+' veces'});
        }else{
            res.send({mensaje: 'Has visitado la pagina '+req.session.contador+' veces'});
        }

        
    }else{

        req.session.contador = 1;
        
        if(nombre){
            req.session.nombre = nombre;
            res.send('Te damos la bienvenida '+nombre);
        }else{
            res.send('Te damos la bienvenida');
        }        
        
    }


})



app.get('/olvidar', (req,res)=>{


        req.session.destroy(err=>{
            if(err){
                res.json({ error: 'olvidar', body: err});
            }else{
                res.send('hasta luego');
            }
        })
})


app.get('/index', (req,res)=>{

    // if(!req.session.nombre_usuario){
    //     res.redirect('/login.html');
    // }else{
    //     res.redirect('/index.html');
    // }

    if(!req.session.nombre_usuario){
        res.render('pages/login');
    }else{
        res.render('pages/index', {nombre : req.session.nombre_usuario});
    }
})

app.get('/login', (req,res)=>{

    if(!req.session.nombre_usuario){
        res.render('pages/login');
    }else{
        res.render('pages/index', {nombre : req.session.nombre_usuario});
    }
})

app.post('/login', (req,res)=>{

    req.session.nombre_usuario = req.body.nombre;

    if(!req.session.nombre_usuario){
        res.render('pages/login');
    }else{
        res.render('pages/index', {nombre : req.session.nombre_usuario});
    }
})


app.get('/register', (req,res)=>{

        res.render('pages/register');

})

app.post('/logout', (req,res)=>{

    let nombre = req.session.nombre_usuario;

    req.session.destroy(err=>{
        if(err){
            res.json({ error: 'olvidar', body: err});
        }else{
            res.render('pages/logout', {nombre : nombre});
        }
    })


})



app.get('/info', (req, res) => {
    console.log('------------ req.session -------------')
    console.log(req.session)
    console.log('--------------------------------------')

    console.log('----------- req.sessionID ------------')
    console.log(req.sessionID)
    console.log('--------------------------------------')

    console.log('----------- req.cookies ------------')
    console.log(req.cookies)
    console.log('--------------------------------------')

    console.log('---------- req.sessionStore ----------')
    console.log(req.sessionStore)
    console.log('--------------------------------------')

    res.send('Send info ok!')
})