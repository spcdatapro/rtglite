import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class TipoDireccionService {
    public url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'tdir/'; }

    listaTiposDeDireccion(token, cuales = '0') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lsttiposdir/' + cuales, { headers: headers }).map(res => res.json());
    }

    getTipoDireccion(idtipodir, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'gettipodir/' + idtipodir, { headers: headers }).map(res => res.json());
    }

    crear(tipoDirNueva, token) {
        const params = JSON.stringify(tipoDirNueva);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'c', params, { headers: headers }).map(res => res.json());
    }

    modificar(tipoDireccion, token) {
        const params = JSON.stringify(tipoDireccion);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'u/' + tipoDireccion._id, params, { headers: headers }).map(res => res.json());
    }

    eliminar(idtipodir, token) {
        const params = JSON.stringify({ _id: idtipodir, debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'd/' + idtipodir, params, { headers: headers }).map(res => res.json());
    }
}
