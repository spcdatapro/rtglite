import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class MenuRestComponenteService {
    private url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'mnurstcompo/'; }

    listaMenuRestComponente(token, idmenurest) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstmnurstcompo/' + idmenurest, { headers: headers }).map(res => res.json());
    }

    getMenuRestComponente(idmenurestcompo, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getmnurstcompo/' + idmenurestcompo, { headers: headers }).map(res => res.json());
    }

    crear(entidad, token) {
        const params = JSON.stringify(entidad);
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
