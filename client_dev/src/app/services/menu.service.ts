import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class MenuService {
    private url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'mnu/'; }

    getMenuUsuario(idusuario, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstmnuusr/' + idusuario, { headers: headers }).map(res => res.json());
    }
}
