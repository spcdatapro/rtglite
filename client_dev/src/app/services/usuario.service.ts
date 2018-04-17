import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UsuarioService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url + 'usr/';
    }

    signup(usuario_a_loggear) {
        usuario_a_loggear.gettoken = true;
        const params = JSON.stringify(usuario_a_loggear);
        const headers = new Headers({ 'Content-Type': 'application/json'});

        return this._http.post(this.url + 'login', params, {headers: headers}).map(res => res.json());
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

    listaUsuarios(token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'lstusuarios', { headers: headers }).map(res => res.json());
    }

    getUsuario(identidad, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getusuario/' + identidad, { headers: headers }).map(res => res.json());
    }

}
