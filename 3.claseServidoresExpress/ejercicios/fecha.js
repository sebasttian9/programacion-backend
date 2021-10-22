const moment = require("moment");
const hoy = moment();
const fecha = moment().format('D/M/YYYY');
const nacimiento = moment('09/12/1992','DD/MM/YYYY');
// console.log('Hoy es : '+fecha);
// console.log('Hoy es : '+fecha);
const diffAños = hoy.diff(nacimiento, 'years');
const diffDias = hoy.diff(nacimiento, 'days');
var a = moment([2021]);
var b = moment([1992]);
a.diff(b, 'years') // 1

console.log(diffAños);
console.log(diffDias);