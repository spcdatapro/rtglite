import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

import { MenuRestaurante } from '../models/menurest';

@Injectable()
export class DiccionarioFoxService {
    public url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'diccf/'; }

    listaDiccionarioFox(token, cuales = '0') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstdiccf/' + cuales, { headers: headers }).map(res => res.json());
    }

    getDiccionarioFox(identidad, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getdiccf/' + identidad, { headers: headers }).map(res => res.json());
    }

    async getProductoMint(idmint: number, token: string): Promise<MenuRestaurante> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        try {
            const response = await this._http.get(this.url + 'getprodidmint/' + idmint, { headers: headers }).toPromise();
            const res = response.json();
            if (!res.entidad) {
                return null;
            }
            return res.entidad;
        } catch (error) {
            await console.log('ERROR: ', error);
        }

        // return this._http.get(this.url + 'getprodidmint/' + idmint, { headers: headers }).map(res => res.json());
    }

    crear(entidadNueva, token) {
        const params = JSON.stringify(entidadNueva);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'c', params, { headers: headers }).map(res => res.json());
    }

    modificar(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'u/' + entidad._id, params, { headers: headers }).map(res => res.json());
    }

    eliminar(identidad, token) {
        const params = JSON.stringify({ _id: identidad, debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'd/' + identidad, params, { headers: headers }).map(res => res.json());
    }
}
