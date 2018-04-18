import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { ComandaService } from './comanda.service';
import { DiccionarioFoxService } from './diccionariofox.service';
import { ClienteService } from './cliente.service';
import { LocalStorageService } from './localstorage.service';

import { Comanda } from '../models/comanda';
import { DetalleComanda } from '../models/detallecomanda';
import { BitacoraEstatus } from '../models/bitacoraestatus';
import { Cliente } from '../models/cliente';
import { TelefonoCliente } from '../models/telefonocliente';
import { DireccionCliente } from '../models/direccioncliente';
import { DatoFacturaCliente } from '../models/datosfactcliente';
import * as moment from 'moment';

@Injectable()
export class MintService {
    private url: string;
    private datosEjemplo: string;
    private uid: string;

    private getTestData() {
        return `[
{
      "cliente":{
         "apellidos":"Ejemplo",
         "correoElectronico":"ejemplo@ejemplo.com",
         "idCliente":123,
         "nit":"C/F",
         "nombres":"Ejemplo",
         "razonSocial":"Ejemplo S.A.",
         "telefono":"12340000"
      },
      "codigoAuorizacionCashless":79147,
      "detalle":[
         {
            "cantidad":1,
            "descripcion":"Producto 1",
            "idOrdenDetalle":76485,
            "idProducto":200,
            "precio":25.00,
            "total":25.00
         },
         {
            "cantidad":1,
            "descripcion":"Producto 2",
            "idOrdenDetalle":76486,
            "idProducto":230,
            "precio":25.00,
            "total":25.00
         }
      ],
      "fecha":"2018-01-26T15:24:40.17",
      "idComercio":24,
      "idOrden":58365,
      "idTransaccionCashless":185835,
      "idUsuario":"3052ff59-9cc0-4afa-a4d5-72a4e851d944",
      "nombreComercio":"Comercio Ejemplo",
      "total":50.00
   },
   {
      "cliente":{
         "apellidos":"Test",
         "correoElectronico":"Testtestest@gmail.com",
         "idCliente":3948,
         "nit":"C/F",
         "nombres":"Test",
         "razonSocial":"Test Test",
         "telefono":"12340000"
      },
      "codigoAuorizacionCashless":98020,
      "detalle":[
         {
            "cantidad":1,
            "descripcion":"Producto Especial 3",
            "idOrdenDetalle":76484,
            "idProducto":1034,
            "precio":20.00,
            "total":20.00
         }
      ],
      "fecha":"2018-01-26T15:23:42.497",
      "idComercio":20,
      "idOrden":58364,
      "idTransaccionCashless":185828,
      "idUsuario":"45074c9a-49cf-4ab7-a80c-65fe166a21db",
      "nombreComercio":"Comercio Test",
      "total":20.00
   }
]`;
    }

    constructor(
        private _http: Http, private _comandaService: ComandaService, private _dictFoxService: DiccionarioFoxService,
        private _clienteService: ClienteService, private _ls: LocalStorageService
    ) {
        this.url = GLOBAL.url + 'rest/';
        this.datosEjemplo = this.getTestData();
        this.uid = this._ls.get('restouchusr')._id;
    }

    private async nuevaComanda(token: string, pedido: any) {
        const comanda = new Comanda(
            null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, [], [], [], null, null, null, [], [], null, false
        );

        comanda.tracking = pedido.idOrden;
        comanda.fecha = moment(pedido.fecha).toDate();
        comanda.idrestaurante = '5ad6721a0d8e6921dc3bd97a';
        comanda.totalcomanda = pedido.total;
        comanda.cantidaditems = pedido.detalle.length;
        comanda.idestatuscomanda = '59fea7524218672b285ab0e3';
        comanda.fechainitoma = moment(pedido.fecha).toDate();
        comanda.fechafintoma = moment(pedido.fecha).toDate();
        comanda.idusuario = this.uid;
        comanda.idtipocomanda = '5a67816637dfc108b9248851';
        comanda.bitacoraestatus.push(
            new BitacoraEstatus('59fea7524218672b285ab0e3', 'Recibido en restaurante', moment(pedido.fecha).toDate())
        );
        comanda.debaja = false;
        pedido.detalle.forEach(async (det, i) => {
            const producto = await this._dictFoxService.getProductoMint(+det.idProducto, '');
            if (producto) {
                comanda.detallecomanda.push(
                    new DetalleComanda(
                        producto._id, +det.cantidad, producto.precio, null, producto.descripcionfull, null, null,
                        producto.limitecomponentes, producto.tieneextras, producto.precioextra, false
                    )
                );
            }
        });

        let cliente = await this._clienteService.getCliByTelAsync(pedido.cliente.telefono, '');
        if (!cliente) {
            const tmp = await this._clienteService.crearPaqueteClienteAsync(
                new Cliente(
                    null, (pedido.cliente.nombres + ' ' + pedido.cliente.apellidos), null, null,
                    pedido.cliente.correoElectronico, false, null, false
                ),
                new TelefonoCliente(null, null, pedido.cliente.telefono, false),
                new DireccionCliente(null, null, null, null, null, null, null, null, false),
                new DatoFacturaCliente(null, null, pedido.cliente.nit, pedido.cliente.razonSocial, null, false),
                ''
            );
            cliente = await this._clienteService.getCliByTelAsync(tmp.telefono, '');
        }
        comanda.idcliente = cliente._id;
        const telefono = await this._clienteService.getTelefonoClienteNumtelAsync(cliente._id, pedido.cliente.telefono, '');
        comanda.idtelefonocliente = telefono._id;
        return await this._comandaService.crearComandaAsync(comanda, token);
    }


    listaPedidos(token: string, cuales = '0') {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        const nuevas: Array<string> = [];
        let pedidos: Array<any>;
        // return this._http.get(this.url + 'lstrestaurantes/' + cuales, { headers: headers }).map(res => res.json());
        pedidos = JSON.parse(this.datosEjemplo);
        pedidos.forEach(async (pedido, i) => {
            const comanda = await this._comandaService.getComandaByTrackingNo(+pedido.idOrden, token);
            if (!comanda) {
                const nueva = await this.nuevaComanda(token, pedido);
                nuevas.push(nueva.tracking.toString());
            } else {
                console.log('Ya existe el pedido No. ' + pedido.idOrden + '.');
            }
        });
        console.log('Agregadas: ', nuevas);
        return [];
    }
}
