const faker = require('faker');
faker.locale = 'es';


function crearProductosFaker(){

    return {
        nombre: faker.name.firstName(),
        precio: Math.trunc(faker.commerce.price(0,100000,0)),
        foto: faker.image.imageUrl()
    }

}

function generarProductos(num){
    const productos = []
    for(let i = 0; i< num; i++){
        productos.push(crearProductosFaker());
    }
// console.log(productos);
    return productos;
}

module.exports = { generarProductos }