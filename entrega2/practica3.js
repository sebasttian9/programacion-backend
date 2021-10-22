const fs = require('fs');

fs.promises.readFile('info.txt','utf-8')
.then(contenido =>{
    const info = JSON.parse(contenido);
    console.log(info.contenidoObj);
    info.contenidoObj.author  = 'Coderhouse';

    fs.promises.writeFile('package.json.coder.json',JSON.stringify(info.contenidoObj,null,2))
    .then(()=>{
        console.log('grabado');
    })
    .catch(error=>{console.log});
})
.catch(error =>{
    console.log(error)
})