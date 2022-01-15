var mongoose = require('mongoose');
 
module.exports = mongoose.model('usuarios',{
    nombre: String,
    password: String
});