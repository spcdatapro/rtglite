'use strict'

var moment = require('moment');

class ProductoComanda{
    constructor(
        _idrestaurante, _restaurante, _idcomanda, _tracking, _fecha,
        _idpadreproducto, _rutaproducto, _idproducto, _producto, _cantidad,
        _preciounitario
    ) {
        this.idrestaurante = _idrestaurante;
        this.restaurante = _restaurante;
        this.idcomanda = _idcomanda;
        this.tracking = _tracking;
        this.fecha = moment(_fecha).format('DD/MM/YYYY HH:mm:ss');
        this.idpadreproducto = _idpadreproducto;
        this.rutaproducto = _rutaproducto;
        this.idproducto = _idproducto;
        this.producto = _producto;
        this.cantidad = +_cantidad;
        this.preciounitario = parseFloat(_preciounitario);
        this.precio = parseFloat((_preciounitario * _cantidad).toFixed(2));
    }

    static getListaOrdenada(lista){
        return lista.sort(function (a, b) {
            return ((a.rutaproducto + ' - ' + a.producto) > (b.rutaproducto + ' - ' + b.producto)) ? 1 : (((b.rutaproducto + ' - ' + b.producto) > (a.rutaproducto + ' - ' + a.producto)) ? -1 : 0);
        });
    }

    static filter_array(test_array) {
        let index = -1;
        const arr_length = test_array ? test_array.length : 0;
        let resIndex = -1;
        const result = [];

        while (++index < arr_length) {
            const value = test_array[index];

            if (value) {
                result[++resIndex] = value;
            }
        }

        return result;
    }

    static getGrupos(lista){
        return this.filter_array([...new Set(lista.map(item => item.rutaproducto))]);
    }

    static getSubGrupos(grupo, lista) {
        return this.filter_array([...new Set(lista.map((item) => {
            if(item.rutaproducto == grupo){
                return item.producto;
            }
        }))]);
    }

    static getProductosOrdenadosCantidad(productos, direccion = true){
        return productos.sort((a, b) => {
            return a.cantidad > b.cantidad ? (direccion ? 1 : -1) : (b.cantidad > a.cantidad ? (direccion ? -1 : 1) : 0);
        });
    }
}

module.exports = ProductoComanda;