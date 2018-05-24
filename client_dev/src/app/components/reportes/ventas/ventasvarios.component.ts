import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

// Servicios
import { GLOBAL } from '../../../services/global';
import { LocalStorageService } from '../../../services/localstorage.service';
import { JsReportService } from '../../../services/jsreport.service';

// Otros
import * as moment from 'moment';

@Component({
    selector: 'app-rpt-ventasvarios',
    templateUrl: './ventasvarios.component.html',
    providers: [LocalStorageService, JsReportService]
})
export class VentasVariosComponent implements OnInit {
    public params = {
        fdel: moment().startOf('month').format('YYYY-MM-DD'),
        fal: moment().endOf('month').format('YYYY-MM-DD'),
        token: ''
    };
    public content = undefined;
    public reporte = 'H1K11S7ym';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _ls: LocalStorageService,
        private _jsReport: JsReportService,
        private _sanitizer: DomSanitizer
    ) {
        this.params.token = this._ls.get('restouchusr').token;
    }

    ngOnInit() { }

    getReporte() {
        this._jsReport.getPDFReport(this.reporte, this.params).then(res => { this.content = res; });
    }

}
