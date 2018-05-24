'use strict'

var mongoose = require('mongoose');
var fs = require('fs');
var app = require('./app');
var port = process.env.PORT || 3789;

var baseDeDatos = fs.readFileSync('bd.txt', 'utf8');
console.log('Base de datos seleccionada:', baseDeDatos);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/' + baseDeDatos, { useMongoClient: true })
.then((conn) => {    
    console.log('Conexión exitosa...');
    app.listen(port, () => { console.log('Servidor local corriendo...'); });
})
.catch(err => console.log(err));
