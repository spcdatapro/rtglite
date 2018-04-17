import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class MenuRestauranteService {
    private url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'mnurest/'; }

    menurestaurante(token: string, cuales: string = '0') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstmenurest/' + cuales, { headers: headers }).map(res => res.json());
    }

    listamenu(token: string, cuales: number = 0) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstallmenu/' + cuales, { headers: headers }).map(res => res.json());
    }

    getCarta(token: string, nivel: number, idpadre: string = null) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getcarta/' + nivel + (!idpadre ? '' : ('/' + idpadre)), { headers: headers })
        .map(res => res.json());
    }

    crear(mnurestNvo, token: string) {
        const params = JSON.stringify(mnurestNvo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'c', params, { headers: headers }).map(res => res.json());
    }

    modificar(mnurestUpd, token: string) {
        const params = JSON.stringify(mnurestUpd);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'u/' + mnurestUpd._id, params, { headers: headers }).map(res => res.json());
    }

    getMenu(idmenu, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getmenu/' + idmenu, { headers: headers }).map(res => res.json());
    }
}
