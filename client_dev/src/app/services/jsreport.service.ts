import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class JsReportService {
    public url: string;

    constructor(private _http: HttpClient, private _sanitizer: DomSanitizer) {
        this.url = 'http://' + window.location.hostname + ':5489/api/report'; // servidor de produccion
    }

    getPDFReport(shortid: string, obj) {
        const props = { 'template': { 'shortid': shortid }, 'data': obj };
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url, props, { responseType: 'arraybuffer' }).toPromise().then(res => {
            const file = new Blob([res], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            return this._sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        });
    }

}
