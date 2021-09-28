
class Usuario {

    constructor(nombre,apellido,libros,mascotas){

        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
        console.log('this:',this);

    }


    getFullName = () => {

            return `Nombre Completo: ${this.nombre +' '+ this.apellido}`;
    }

    addMascota = (nombre) => {

        this.mascotas.push(nombre);
    }

    countMascotas = () => {

        return this.mascotas.length;
    }

    addBook = (nombre,autor) => {

        this.libros.push({nombre: nombre,autor: autor});

    }

    getBookNames = () => {

        let nombreLibros = [];
        this.libros.map(l => {
           nombreLibros.push(l.nombre); 
        })

        return nombreLibros; 
    }

}

libros = [{ nombre: 'Papelucho', autor: 'Marcela Paz'}];
mascotas = ['Perro'];
user = new Usuario('Sebastian','Valenzuela',libros,mascotas);

user.addMascota('gato')
user.addBook('seba','paula');
console.log(user.countMascotas());
console.log(user.getFullName());
// console.log(user);
console.log(user.getBookNames());
///