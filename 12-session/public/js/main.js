const socket = io();

const formAgregarProductos = document.getElementById('FormsProductos')
formAgregarProductos.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    e.preventDefault()

    // armo la persona extrayendo los datos de los campos del formulario

    // document.getElementById('txtNombre').value
    const producto = {
        titulo: formAgregarProductos[ 0 ].value, // document.getElementById('txtNombre').value
        precio: formAgregarProductos[ 1 ].value,
        url :  formAgregarProductos[ 2 ].value,// document.getElementById('txtApellido').value
    }

    // envio la persona al servidor via socket
    socket.emit('update', producto);

    // limpio el contenido de los campos del formulario
    formAgregarProductos.reset()
})

// agrego manejador de eventos de tipo 'personas'
socket.on('productos', manejarEventoProductos);

async function manejarEventoProductos(productos) {
    console.log('desde main',productos)

    // busco la plantilla del servidor
    const recursoRemoto = await fetch('plantilla/tabla_productos.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con las personas recibidas
    productos = JSON.parse(productos);
    console.log('desde main 2',productos.length)
    const html = functionTemplate({ productos })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('Productos').innerHTML = html
}




// chat

const btn = document.getElementById('btnEnviarChat')
btn.addEventListener('click', e => {


    // prevengo que el formulario recargue la pagina al hacer submit
    // e.preventDefault()
    console.log('envia msj')
    // armo la persona extrayendo los datos de los campos del formulario

    const email = document.getElementById('email').value
    const nombre = document.getElementById('nombre').value
    const apellido = document.getElementById('apellido').value
    const edad = document.getElementById('edad').value
    const alias = document.getElementById('alias').value
    const avatar = document.getElementById('avatar').value
    const texto = document.getElementById('txtMensaje').value

    if(email==''){
        alert('Ingrese email');
        document.getElementById('email').focus();
        return
    }

    const cuerpo = {
        autor: {
        id: email, // document.getElementById('txtNombre').value
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        alias: alias, 
        avatar:avatar,
        fecha: new Date().toLocaleString()
        },
        text: texto
    }

    // envio la persona al servidor via socket
    socket.emit('chat', cuerpo);

    // limpio el contenido de los campos del formulario
    document.getElementById('txtMensaje').value = '';
})



socket.on('chat', mensajes =>{
    console.log('console log, desde main',mensajes)
    if(mensajes.length>0){
        const mensajesHTML = mensajes
        .map(msj => `<span class='email'> ${msj.autor.id} </span> <span class='fyh'> [${msj.autor.fecha}] </span>  <span class='msj'>${msj.text}</span> <img src='${msj.autor.avatar}' width='40px'>`)
        .join('<br>')
        document.getElementById('mensajes').innerHTML = mensajesHTML;
    }else{
        document.getElementById('mensajes').innerHTML = 'No hay msj';
    }
});