const fs = require('fs');

const datos = fs.readFile('package.json','utf-8', (error, contenido) =>{

        if(error){

            console.log(error);
        }else{

             
            const {size} = fs.statSync('package.json');

            const info = {

                contenidoStr: JSON.stringify(contenido),
                contenidoObj: JSON.parse(contenido),
                size: size
            }

            console.log(contenido,info);


            fs.writeFile('info.txt',JSON.stringify(info,null,2), error =>{

                if(error){

                    console.log(error);

                }else{

                    console.log('escrito')
                }
            })
        }

});