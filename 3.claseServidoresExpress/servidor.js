// import Contenedor from './contenedor.js';
const express = require('express');
const Contenedor = require('./contenedor');
// import { express } from 'pkg';


const cont = new Contenedor('productos.txt');
const app = express();
const PORT = 8080;

const server = app.listen(PORT, ()=>{
    console.log(`escuchando en el puerto ${server.address().port}`);
})
server.on("error", error => console.log(`error en server : ${error}`));


app.get('/', (req,res)=>{
    res.send('<h1 style="color:blue">Bienvenidos al servidor express</h1>');
});

visit = 0;
app.get('/visita', (req,res)=>{
    visit++;
    res.send('La cantidad de visitas es '+visit);
});


app.get('/fyh', (req,res)=>{
    const date = new Date();
    res.send({fecha : date.toLocaleString()});
});

app.get('/productos', (req,res)=>{
    cont.getAll().then(resp =>{
        res.send(resp);
    }).catch(error =>{
        res.send(`error server ${error}`);
    })    // console.log(productos);    
    
});


// funcion random
function getAleatorio(min,max){
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

app.get('/productosRandom',(req,res)=>{
        cont.getAll().then(resp =>{
        const num = getAleatorio(0,(resp.length-1));
        // console.log(num);
        res.send(resp[num]);
    }).catch(error =>{
        res.send(`error server ${error}`);
    })    // console.log(productos); 

});