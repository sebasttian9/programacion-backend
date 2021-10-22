console.log('hola mundo');
const fs = require('fs');


try {

    fs.writeFileSync('fyh.txt','fecha hoy');
    
} catch (error) {
    
    console.log('error '+error);
}


try {

    const data = fs.readFileSync('fyh.txt','utf-8');
    console.log(data);
} catch (error) {
    
    console.log('error '+error);
}