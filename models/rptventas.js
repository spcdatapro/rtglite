'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReporteVentasSchema = Schema({
    idrestaurante: { type: Schema.ObjectId, ref: 'restaurante'},
    restaurante: String,
    idcomanda: { type: Schema.ObjectId, ref: 'comanda'},
    tracking: Number,
    fecha: String,
    idpadreproducto: { type: Schema.ObjectId, ref: 'menurest' },
    rutaproducto: String,
    idproducto: { type: Schema.ObjectId, ref: 'menurest' },
    producto: String,
    cantidad: Number,
    preciounitario: Number,
    precio: Number
});

module.exports = mongoose.model('reporteventas', ReporteVentasSchema, 'reporteventas');