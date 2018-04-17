import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { DiccionarioFox } from '../../models/diccionariofox';

// Servicios
import { GLOBAL } from '../../services/global';
import { LocalStorageService } from '../../services/localstorage.service';
import { DiccionarioFoxService } from '../../services/diccionariofox.service';

// Otros
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
    selector: 'app-diccionario-fox',
    templateUrl: './diccionariofox.component.html',
    providers: [LocalStorageService, DiccionarioFoxService]
})
export class DiccionarioFoxComponent implements OnInit {
    private toasterService: ToasterService;
    private token = null;
    public dictfox: Array<DiccionarioFox>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _ls: LocalStorageService,
        private _diccionarioFoxService: DiccionarioFoxService,
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;
        this.token = this._ls.get('restouchusr').token;
        this.dictfox = [];
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({ positionClass: 'toast-bottom-full-width' });

    ngOnInit() {
        this.loadDiccionarioFox();
    }

    private loadDiccionarioFox() {
        this._diccionarioFoxService.listaDiccionarioFox(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.dictfox = response.lista;
                } else {
                    this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    saveDictFox(obj) {
        this._diccionarioFoxService.modificar(obj, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.toasterService.pop('success', 'Actualización', response.mensaje);
                } else {
                    this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

}
