const productos = [
    { id:1, nombre:'Escuadra', precio:323.45 },
    { id:2, nombre:'Calculadora', precio:234.56 },
    { id:3, nombre:'Globo Terráqueo', precio:45.67 },
    { id:4, nombre:'Paleta Pintura', precio:456.78 },
    { id:5, nombre:'Reloj', precio:67.89 },
    { id:6, nombre:'Agenda', precio:78.90 }
];

const reducer = (previousValue, currentValue) => previousValue + currentValue;


nombres = '';
cont = 0;
precioTotal = 0;
menorPrecio = [];
precioMin = productos[0].precio;
prod = productos[0];

precioMax = productos[0].precio;
prod2 = productos[0];

productos.map(p => {
        console.log(p.nombre);
        if(cont==0){
            nombres = nombres + p.nombre;
        }else{
            nombres = nombres + ','+p.nombre;
        }

        
        
        if(precioMin > p.precio){
            precioMin = p.precio;
            prod = p;
        }

        if(p.precio > precioMax){
            precioMax = p.precio;
            prod2 = p;
        }

        
        cont++;
});


const obj = {

    nombres : nombres,
    precioTotal: Number(Object.values(productos).reduce((t, {precio}) => t + precio, 0).toFixed(2)),
    precioPromedio: Number((Object.values(productos).reduce((t, {precio}) => t + precio, 0)/productos.length).toFixed(2)),
    prodMenorPrecio: prod,
    prodMayorPrecio: prod2,
}

// console.log(nombres);
// console.log(Object.values(productos).reduce((t, {precio}) => t + precio, 0));
// console.log(Object.values(productos).reduce((t, {precio}) => t + precio, 0)/productos.length);
// console.log(precioMin);
// console.log(prod);
// console.log(precioMax);
// console.log(prod2);

console.log(obj);