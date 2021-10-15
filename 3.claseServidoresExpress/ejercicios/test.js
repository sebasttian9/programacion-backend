import Contenedor from './contenedor.js';

const cont = new Contenedor('productos.txt');
let objeto = {
    title: 'test',
    price: 1200,
    thumbnail: 'test'
}
// cont.save(objeto);
// cont.getById(1);
cont.getAll();
// cont.deleteById(2);
// cont.deleteAll();