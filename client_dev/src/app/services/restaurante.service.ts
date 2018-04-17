import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class RestauranteService {
    private url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'rest/'; }

    listaRestaurantes(token, cuales = '0') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstrestaurantes/' + cuales, { headers: headers }).map(res => res.json());
    }

    getRestaurante(idrestaurante, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getrestaurante/' + idrestaurante, { headers: headers }).map(res => res.json());
    }

    crear(restNuevo, token) {
        const params = JSON.stringify(restNuevo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'c', params, { headers: headers }).map(res => res.json());
    }

    modificar(restaurante, token) {
        const params = JSON.stringify(restaurante);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'u/' + restaurante._id, params, { headers: headers }).map(res => res.json());
    }

    eliminar(idrestaurante, token) {
        const params = JSON.stringify({ _id: idrestaurante, debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'd/' + idrestaurante, params, { headers: headers }).map(res => res.json());
    }
}
