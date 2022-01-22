// Import
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
// const fs = require('fs');
const bcrypt = require('bcrypt');
const { Mensajes } = require('./contenedorMensajes');
const { Productos } = require('./contenedorProductos');
const Contenedor = require('./contenedor');
const { sqlite3: optionsLite } = require('./conexion/sqlite3');
const { mysql: options } = require('./conexion/mysql');
const { generarProductos } = require('./faker/productos');
const { normalize, denormalize, schema } = require("normalizr");
const util = require('util')
const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const MongoStore = require('connect-mongo');
// const ProductosDtoMongo = require('./DTO/mongoDto.js');
const passport = require('passport');
// const DtoMongo = new ProductosDtoMongo();
const LocalStrategy = require('passport-local').Strategy;
const controllersdb = require('./controllersdb')
const User = require('./model/usuariosModel');
const { fork } = require('child_process')
const path = require('path')
// const config = require("./config.js");

// DOTENV
require('dotenv').config();

//MINIMIST
const parseArgs = require('minimist');
const options2 = {
    alias: {
        m: 'modo',
        p: 'puerto',
        d: 'debug'
    },
    default: {
        modo: 'prod',
        puerto: 8080,
        debug: false
    }
}

const commandLineArgs = process.argv.slice(2);

const { modo, puerto, debug, _ } = parseArgs(commandLineArgs, options2);
// const args = parseArgs(process.argv.slice(2));
// console.log(args);
console.log({ modo, puerto, debug, otros: _ });


function isValidPassword(password, BdPass) {
    return bcrypt.compareSync(password, BdPass)
}

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

// Inicializar
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer); // servidor de socket
const contenedorMensajesIns = new Mensajes(optionsLite);
const contenedorProductos = new Productos(options);
const contenedorMensajes = new Contenedor('mensajes2.txt');


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({

    // store: new FileStore({path: './sesiones', ttl:60, retries: 0}),
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/sesiones', ttl: 600 },),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    autoRemove: 'interval',
    autoRemoveInterval: 10 /* In minutes. Default,
     cookie: { maxAge: 60000}*/
}));




//PASSPORT REGISTRO

passport.use(
    'register',
    new LocalStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {

            User.findOne({ nombre: username }, function (err, user) {
                
                // DtoMongo.login2(username).then(function (err, user) {
                if (err) {
                    console.log('Error in SignUp: ' + err)
                    return done(err)
                }

                if (user) {
                    console.log('User already exists')
                    return done(null, false)
                }

                const newUser = {
                    nombre: username,
                    password: createHash(password)
                }

                User.create(newUser, (err, userWithId) => {
                    // DtoMongo.save(newUser).then((err, userWithId)=> {
                    if (err) {
                        console.log('Error in Saving user: ' + err)
                        return done(err)
                    }
                    console.log(user)
                    console.log('User Registration succesful')
                    return done(null, userWithId)
                })
            })
        }
    )
)

// PASSPORT LOGIN

passport.use(
    'login',
    new LocalStrategy((username, password, done) => {
      User.findOne({ nombre: username }, (err, user) => {
        if (err) return done(err)
  
        if (!user) {
          console.log('User Not Found with username ' + username)
          return done(null, false)
        }
  
        if (!isValidPassword(password,user.password)) {
            // console.log(password, user);
          console.log('Invalid Password')
          return done(null, false)
        }
  
        return done(null, user)
      })
    })
  )

// Agregando Passport
app.use(passport.initialize());
app.use(passport.session());

passport.deserializeUser((id, done) => {
    User.findById(id, done)
})

passport.serializeUser((user, done) => {
    done(null, user._id)
})


// configuro el socket

io.on('connection', async socket => {

    // console.log('Nuevo cliente conectado!');

    // Carga inicial de mensajes
    contenedorMensajes.getAll().then((row) => {

        socket.emit('chat', row);
    })


    // actualizacion de productos
    socket.on('update', producto => {
        console.log(producto);

        contenedorProductos.insertarProductos(producto).then(() => {
            console.log('insertado producto');

            contenedorProductos.selectProductos().then((row) => {
                console.log(row);
                io.sockets.emit('productos', JSON.stringify(row));
            })
        })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                contenedorProductos.cerrarDB();
            });
        // productos.push(producto)


    })

    // Chat
    socket.on('chat', mensaje => {
        // mensajes.push(mensaje);
        // Insertar mensajes en sqllite3
        contenedorMensajes.save(mensaje).then(() => {
            console.log('insertado mensaje');

            contenedorMensajes.getAll().then((row) => {
                console.log(row);
                // mensajes  = row;
                io.sockets.emit('chat', row);
            })
        })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                // contenedorMensajesIns.cerrarDB();
            });

    })
});


// CONEXION BASE DE DATOS Y SERVIDOR

console.log(process.env.cnxStr);
controllersdb.conectarDB(process.env.cnxStr, err => {
    if (err) return console.log('error en conexión de base de datos', err)
    console.log('BASE DE DATOS CONECTADA')

    httpServer.listen(puerto, () => console.log('SERVER ON'))
    httpServer.on('error', (error) => { })
})



const default_cant_productos = process.env.default_cant_productos;
app.get('/api/productos-test', (req, res) => {

    res.json(generarProductos(default_cant_productos));
})

// setear cookie sin tiempo
app.get('/set', (req, res) => {
    res.cookie('server', 'express').send('cookie set');
})

// setear cookie con 30 segundos se vida
app.get('/setEX', (req, res) => {
    res.cookie('server2', 'express', { maxAge: 30000 }).send('cookie setEX');
})

// obtener valor de cookie por el nombre
app.get('/get', (req, res) => {
    res.send(req.cookies.server);
})


// borrar una cookie por el nombre
app.get('/clr', (req, res) => {
    res.clearCookie('server').send('cookie clear');
})


// borrar una cookie por el nombre
app.get('/cookies', (req, res) => {
    res.json({ normales: req.cookies, firmadas: req.signedCookies });
})

// borrar una cookie por el nombre
app.post('/cookies', (req, res) => {

    let nombre = req.body.nombre;
    let valor = req.body.valor;
    let tiempo = req.body.tiempo;

    console.log(nombre, valor, tiempo);

    if (!nombre || !valor) {
        res.send({ error: 'Falta nombre o valor' });
        return
    }

    if (!tiempo) {
        res.cookie(nombre, valor, { signed: true }).send(`cookie1 ${nombre} creada`);
    } else {
        res.cookie(nombre, valor, { signed: true, maxAge: 1000 * parseInt(tiempo) }).send(`cookie2 ${nombre} creada`);
    }


})


// borrar una cookie por el nombre
app.delete('/coockie/:name', (req, res) => {
    let nombre = req.params.name;

    res.clearCookie(nombre).send('cookie' + nombre + ' Eliminada');
})




// SESSIONES 


// INDEX
app.get('/', requireAuthentication, (req, res) => { res.render('pages/index', { nombre: req.session.nombre_usuario }); })

//LOGIN
app.get('/login', requireAuthentication, (req, res) => { res.render('pages/index', { nombre: req.session.nombre_usuario }); })
app.post('/login',passport.authenticate('login', { failureRedirect: '/error-login' }), (req, res) => {

            req.session.nombre_usuario = req.user.nombre;
            res.render('pages/index', { nombre: req.user.nombre });

})
// app.post('/login', (req, res) => {

//     // Obtengo los datos de login enviados por post
//     const nombre = req.body.nombre;
//     const pass = req.body.clave;

//     DtoMongo.login(nombre).then(resp => {

//         // console.log(resp);
//         const userLogeado = resp;
//         // console.log(pass, userLogeado[0].password);


//         if (!isValidPassword(pass, userLogeado[0].password)) {

//             res.render('pages/error-login');

//         } else {
//             req.session.nombre_usuario = userLogeado[0].nombre;
//             res.render('pages/index', { nombre: req.session.nombre_usuario });
//         }


//     }).catch(error => {

//         res.render('pages/error-login');
//         console.log(error);
//     });



// })
app.get('/error-login', (req, res) => { res.render('pages/error-login'); })


// SIGNUP
app.get('/register', (req, res) => { res.render('pages/register'); })
app.post('/register', passport.authenticate('register', { failureRedirect: '/error-registro' }), (req, res) => {

    // console.log(resp);
    res.render('pages/login');
})
app.get('/error-registro', (req, res) => { res.render('pages/error-registro'); })
// app.post('/register', (req,res)=>{


//     // encriptar pass 
//     const passCryp = createHash(req.body.clave);

//     const objeto = {
//         nombre : req.body.nombre,
//         password: passCryp
//     }

//     console.log('body',req.body);

//     DtoMongo.save(objeto).then(resp=>{

//         // res.json(resp);
//         console.log(resp);
//         res.render('pages/login');


//     }).catch(error =>{
//         // res.json({error : 'Error al guardar producto'+error});
//         res.render('pages/error-registro');
//         // next(err);
//         console.log(error);
//     });

// })




app.get('/root', (req, res) => {

    let nombre = req.query.nombre;

    if (req.session.contador) {

        req.session.contador++;

        if (nombre) {

            res.send({ mensaje: nombre + ' visitado la pagina ' + req.session.contador + ' veces' });
        } else {
            res.send({ mensaje: 'Has visitado la pagina ' + req.session.contador + ' veces' });
        }


    } else {

        req.session.contador = 1;

        if (nombre) {
            req.session.nombre = nombre;
            res.send('Te damos la bienvenida ' + nombre);
        } else {
            res.send('Te damos la bienvenida');
        }

    }


})



app.get('/olvidar', (req, res) => {


    req.session.destroy(err => {
        if (err) {
            res.json({ error: 'olvidar', body: err });
        } else {
            res.send('hasta luego');
        }
    })
})




// middleware para authenticar
function requireAuthentication(req, res, next) {
    if (req.session.nombre_usuario) {
        next();
    } else {
        res.render('pages/login');
    }
}

// middleware para pasar los datos del usuario
function includeUserData(req, res, next) {
    if (req.session.nombre_usuario) { // si existe el nombre en la session buscamos los datos

        DtoMongo.login(req.session.nombre_usuario).then(resp => {

            const userLogeado = resp;
            req.user = userLogeado[0];

        })
    }

}












app.post('/logout', (req, res) => {

    let nombre = req.session.nombre_usuario;

    req.session.destroy(err => {
        if (err) {
            res.json({ error: 'olvidar', body: err });
        } else {
            res.render('pages/logout', { nombre: nombre });
        }
    })


})

// RUTAS ENTREGA 14

app.get('/info', (req, res) => {

    const commandLineArgs = process.argv;


    res.json({ Argumentos : commandLineArgs,
                Path_ejecucion:  commandLineArgs[0],
                node_version : process.versions.node,
                sistema : process.platform,
                memoria : process.memoryUsage().rss,
                process_id: process.pid,
                carpeta_proyecto: commandLineArgs[1]})
})


app.get('/api/randoms', (req, res) => {

    const commandLineArgs = process.argv;
    let max = req.query.cant;

    if(!max){max = 50}
    const computo = fork(path.resolve(__dirname, 'num_random.js'))
    computo.send(max)
    computo.on('message', resultado => {
        res.json({ resultado })
    })



    console.log("fin");

    // res.json(numeros);

})

app.use(express.static('./public'));