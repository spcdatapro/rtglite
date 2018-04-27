import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

import { Comanda } from '../models/comanda';

@Injectable()
export class ComandaService {
    public url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'com/'; }

    // Comanda
    listaComandas(token, idestatuscomanda = '', fdelstr = '', falstr = '') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(
            this.url + 'lstcomandas/' + fdelstr + '/' + falstr + '/' + idestatuscomanda, { headers: headers }).map(res => res.json()
        );
    }

    listaComandasPost(token, parametros) {
        const params = JSON.stringify(parametros);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'lstcomandas', params, { headers: headers }).map(res => res.json());
    }

    getComanda(idcomanda, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getcomanda/' + idcomanda, { headers: headers }).map(res => res.json());
    }

    async getComandaByTrackingNo(trackingNo: number, token: string): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });

        try {
            const response = await this._http.get(this.url + 'getbytrackno/' + trackingNo, { headers: headers }).toPromise();
            const res = response.json();
            if (!res.lista || res.lista.length === 0) {
                return null;
            }
            return res.lista[0];
        } catch (error) {
            await console.log('ERROR: ', error);
        }
    }

    histoComandasCliente(token, idcliente) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstcomcli/' + idcliente, { headers: headers }).map(res => res.json());
    }

    crearComanda(comandaNueva, token) {
        const params = JSON.stringify(comandaNueva);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'c', params, { headers: headers }).map(res => res.json());
    }

    async crearComandaAsync(comandaNueva, token): Promise<Comanda> {
        const params = JSON.stringify(comandaNueva);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        try {
            const response = await this._http.post(this.url + 'c', params, { headers: headers }).toPromise();
            const res = response.json();
            if (!res.entidad) {
                return null;
            }
            return res.entidad;
        } catch (error) {
            await console.log('ERROR: ', error);
        }
    }

    modificarComanda(comandaObj, token) {
        const params = JSON.stringify(comandaObj);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'u/' + comandaObj._id, params, { headers: headers }).map(res => res.json());
    }

    eliminarComanda(idcomanda, token) {
        const params = JSON.stringify({ debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'd/' + idcomanda, params, { headers: headers }).map(res => res.json());
    }

    contadorPorEstatus(token, fdel = '', fal = '') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'contporest/' + fdel + '/' + fal, { headers: headers }).map(res => res.json());
    }

    cambiarEstatus(idcomanda: string, estatus: string) {
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        return this._http.get(this.url + estatus + '/' + idcomanda, { headers: headers }).map(res => res.json());
    }

    // Detalle comanda
    listaDetalleComanda(token, idcomanda) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstdetcomanda/' + idcomanda, { headers: headers }).map(res => res.json());
    }

    getDetalleComanda(token, iddetcom) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getdetcomanda/' + iddetcom, { headers: headers }).map(res => res.json());
    }

    crearDetalleComanda(detComNvo, token) {
        const params = JSON.stringify(detComNvo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'cd', params, { headers: headers }).map(res => res.json());
    }

    modificarDetalleComanda(detComObj, token) {
        const params = JSON.stringify(detComObj);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'ud/' + detComObj._id, params, { headers: headers }).map(res => res.json());
    }

    eliminarDetalleComanda(iddetcom, token) {
        const params = JSON.stringify({ debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'dd/' + iddetcom, params, { headers: headers }).map(res => res.json());
    }

    // Detalle de componentes de comanda
    listaDetalleComponentes(token, identidad) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstdetcompdetcom/' + identidad, { headers: headers }).map(res => res.json());
    }

    getDetalleComponente(token, identidad) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getdetcompdetcom/' + identidad, { headers: headers }).map(res => res.json());
    }

    crearDetalleComponente(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'cdc', params, { headers: headers }).map(res => res.json());
    }

    modificarDetalleComponente(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'udc/' + entidad._id, params, { headers: headers }).map(res => res.json());
    }

    eliminarDetalleComponente(identidad, token) {
        const params = JSON.stringify({ debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'ddc/' + identidad, params, { headers: headers }).map(res => res.json());
    }

    // Extras/notas de comanda
    listaExtrasNotas(token, iddetcom = null, iddetcompdetcom = null) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstextnot/' + iddetcom + '/' + iddetcompdetcom, { headers: headers }).map(res => res.json());
    }

    getExtraNota(token, identidad) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getextnot/' + identidad, { headers: headers }).map(res => res.json());
    }

    crearExtraNota(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'cde', params, { headers: headers }).map(res => res.json());
    }

    modificarExtraNota(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'ude/' + entidad._id, params, { headers: headers }).map(res => res.json());
    }

    eliminarExtraNota(identidad, token) {
        const params = JSON.stringify({ debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'dde/' + identidad, params, { headers: headers }).map(res => res.json());
    }

}
