import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class GoogleApiService {
    private url: string;

    constructor(private _http: Http) { this.url = GLOBAL.url + 'gapi/'; }

    getURLAuth(token: string = '') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'googleurl', { headers: headers }).map(res => res.json());
    }

    getToken(codigo: string = '', token: string = '') {
        const params = JSON.stringify({code: codigo});
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'googletoken', params, { headers: headers }).map(res => res.json());
    }

    updGoogleToken(token: string = '') {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'updgtoken', { headers: headers }).map(res => res.json());
    }

    print(trackingNo: number, token: string = '') {
        const params = JSON.stringify({ tracking: trackingNo });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'print', params, { headers: headers }).map(res => res.json());
    }
}
