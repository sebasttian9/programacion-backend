console.log('servidores node');
const numeros = {};
function getAleatorio(){
    return Math.floor((Math.random() * (21 - 1 + 1)) + 1);
}

for(i=0;i<100;i++){
    const numero = getAleatorio();

    if(!numeros[numero]){
        numeros[numero] = 0;
    }
    numeros[numero]++;
    // console.log(numero);
    
    
}


console.log(numeros);

