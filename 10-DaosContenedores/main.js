import app from "./server.js";
const PORT = 8080;

// se escucha por el puerto asignado 
const server = app.listen(PORT, ()=>{
    console.log("escuchando en puerto "+server.address().port);
})
server.on('error',error => console.log(error));