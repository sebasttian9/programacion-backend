const { sqlite3:optionsLite } = require('../conexion/sqlite3');
const { mysql:options } = require('../conexion/mysql');
const { Mensajes } = require('../contenedorMensajes');
const { Productos } = require('../contenedorProductos');


// const contenedorMensajesIns = new Mensajes(optionsLite);
const contenedorProductos = new Productos(options);

// contenedorMensajesIns.crearTabla().then(()=> console.log('Tabla mensajes creada sqlLite3'));
contenedorProductos.crearTabla().then(()=> console.log('Tabla mensajes creada Mysql'));