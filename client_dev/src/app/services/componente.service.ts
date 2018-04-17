import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class ComponenteService {
    private url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'compo/'; }

    listaComponentes(token, cuales = '0') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstcomponentes/' + cuales, { headers: headers }).map(res => res.json());
    }

    listaExtras(token, cuales = '0') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstextras/' + cuales, { headers: headers }).map(res => res.json());
    }

    getComponente(idcomponente, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getcomponente/' + idcomponente, { headers: headers }).map(res => res.json());
    }

    crear(compoNuevo, token) {
        const params = JSON.stringify(compoNuevo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'c', params, { headers: headers }).map(res => res.json());
    }

    modificar(compo, token) {
        const params = JSON.stringify(compo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'u/' + compo._id, params, { headers: headers }).map(res => res.json());
    }

    eliminar(idcompo, token) {
        const params = JSON.stringify({ _id: idcompo, debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'd/' + idcompo, params, { headers: headers }).map(res => res.json());
    }
}
