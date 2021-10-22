const http = require('http');
const moment = require("moment");
const hora = moment().hours();
// console.log(hora);

const server = http.createServer((req, resp)=>{

    if(hora>=6 && hora<=12){
        resp.end('Buenos dias Mundo');
    }else if(hora>=13 && hora<=19){
        resp.end('Buenas tardes Mundo');
    }else if(hora>=20 && hora<=5){
        resp.end('Buenas Noches Mundo');
    }
    
});


const connect = server.listen(8080, () =>{
    console.log(` servidor Http escuchando en el puerto ${connect.address().port}`);
})