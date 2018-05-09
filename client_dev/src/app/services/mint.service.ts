import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { ComandaService } from './comanda.service';
import { DiccionarioFoxService } from './diccionariofox.service';
import { ClienteService } from './cliente.service';
import { LocalStorageService } from './localstorage.service';
import { GoogleApiService } from './gapi.service';

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
    private token: string;

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
   },
   {
      "cliente":{
         "apellidos":"Aragón Sánchez",
         "correoElectronico":"jaragon@spcdatapro.com",
         "idCliente":3949,
         "nit":"4829032-7",
         "nombres":"Javier Antonio",
         "razonSocial":"Javier Aragón",
         "telefono":"30223231"
      },
      "codigoAuorizacionCashless":98020,
      "detalle":[
         {
            "cantidad":3,
            "descripcion":"Quesoburguesa doble",
            "idOrdenDetalle":76484,
            "idProducto":200,
            "precio":20.00,
            "total":60.00
         }
      ],
      "fecha":"2018-04-26T09:32:42.497",
      "idComercio":20,
      "idOrden":58366,
      "idTransaccionCashless":185830,
      "idUsuario":"45074c9a-49cf-4ab7-a80c-65fe166a21db",
      "nombreComercio":"Jake's Burguer",
      "total":60.00
   }
]`;
    }

    constructor(
        private _http: Http, private _comandaService: ComandaService, private _dictFoxService: DiccionarioFoxService,
        private _clienteService: ClienteService, private _ls: LocalStorageService, private _gapiService: GoogleApiService
    ) {
        this.url = GLOBAL.url + 'mint/';
        // this.datosEjemplo = this.getTestData();
        const rtu = this._ls.get('restouchusr');
        this.uid = rtu ? rtu._id : '';
        this.token = rtu ? rtu.token : '';
    }

    private async nuevaComanda(token: string, pedido: any) {
        const comanda = new Comanda(
            null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, [], [], [], null, null, null, [], [], null, null, false
        );

        comanda.tracking = pedido.idOrden;
        comanda.fecha = moment(pedido.fecha).toDate();
        comanda.idrestaurante = '5af33442122a512fdcd07a27';
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
        for (let i = 0; i < pedido.detalle.length; i++ ) {
            const det = pedido.detalle[i];
            const producto = await this._dictFoxService.getProductoMint(+det.idProducto, '');
            // console.log('Producto del pedido ' + comanda.tracking + ': ', producto);
            if (producto) {
                comanda.detallecomanda.push(
                    new DetalleComanda(
                        producto._id, +det.cantidad, producto.precio, null, producto.descripcionfull, null, null,
                        producto.limitecomponentes, producto.tieneextras, producto.precioextra, false
                    )
                );
            }
        }

        // pedido.detalle.forEach(async (det, i) => { });
        // this.clienteNuevo = new Cliente(null, result, [], null, null, false, [], false);
        const cliente = await this._clienteService.crearAsync(
            new Cliente(null, (pedido.cliente.nombres + ' ' + pedido.cliente.apellidos), [], null, null, false, [], false),
            this.token
        );
        comanda.idcliente = cliente._id;
        comanda.idtelefonocliente = null;
        if (!comanda.detallecomanda || comanda.detallecomanda.length === 0) {
            console.log('Sin detalle: ' + comanda.tracking, comanda);
        }
        return await this._comandaService.crearComandaAsync(comanda, token);
    }


    getMintToken() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.get(this.url + 'token', { headers: headers }).map(res => res.json());
    }

    listaPedidos(token: string, fdelstr: string, falstr: string) {
        const params = JSON.stringify({ fdelstr: fdelstr, falstr: falstr });
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.post(this.url + 'ordenes', params, { headers: headers }).map(res => res.json());
    }

    private async printPedido(trackingNo: number, token: string) {
        this._gapiService.updGoogleToken().subscribe(
            respUpd => {
                this._gapiService.print(trackingNo, this.token).subscribe(
                    respPrint => {
                        console.log('Imprimiento orden No. ' + trackingNo);
                    },
                    errorPrint => {
                        const respuesta = JSON.parse(errorPrint._body);
                        console.log('Error: ' + respuesta.mensaje);
                    }
                );
            },
            errUpd => {
                const respuesta = JSON.parse(errUpd._body);
                console.log('Error: ' + respuesta.mensaje);
            }
        );
    }

    async crearPedidos(pedidos: Array<any>, token: string) {
        const nuevas: Array<string> = [];
        pedidos.forEach(async (pedido, i) => {
            const comanda = await this._comandaService.getComandaByTrackingNo(+pedido.idOrden, token);
            if (!comanda) {
                const nueva = await this.nuevaComanda(token, pedido);
                await this.printPedido(nueva.tracking, token);
                nuevas.push(nueva.tracking.toString());
            } else {
                // console.log('Ya existe el pedido No. ' + pedido.idOrden + '.');
            }
        });
    }
}
