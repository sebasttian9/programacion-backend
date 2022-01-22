const calculos = (max) =>{

    const numeros = {};
    for(let i = 0;i<max;i++){

        const numero =  Math.floor((Math.random() * (1000 - 1 + 1)) + 1);
        if(!numeros[numero]){
            numeros[numero] = 0;
        }
        numeros[numero]++;
        // console.log(numero);
        // console.log(num);        
    }

    return numeros;

}


process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', msg => {
    console.log(`worker #${process.pid} iniciando su tarea`)
    const num = calculos(msg)
    process.send(num)
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})