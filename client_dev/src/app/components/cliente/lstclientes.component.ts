import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { Cliente } from '../../models/cliente';
import { TelefonoCliente } from '../../models/telefonocliente';
import { DireccionCliente } from '../../models/direccioncliente';
import { DatoFacturaCliente } from '../../models/datosfactcliente';

// Servicios
import { GLOBAL } from '../../services/global';
import { ClienteService } from '../../services/cliente.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { Location } from '@angular/common';

// Otros
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { NgbPopoverConfig, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
// import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';

@Component({
    selector: 'app-lst-cliente',
    templateUrl: './lstclientes.component.html',
    providers: [ClienteService, LocalStorageService, NgbPopoverConfig, Location ],
    styles: [ `:host >>> .popover { max-width: 900px; }` ]
})
export class ListadoClientesComponent implements OnInit, AfterViewChecked {
    public clientes: Cliente[];
    public cliente: Cliente;
    public telefonosCliente: TelefonoCliente[];
    public direccionesCliente: DireccionCliente[];
    public datosFacturaCliente: DatoFacturaCliente[];
    public filtroCliente: String;
    public paginaActual: number;
    public totalPaginas: number;
    public totalItems: number;
    public perpage: number;
    private toasterService: ToasterService;
    private token = null;
    private idcliente: string;

    @ViewChild('t')
    private tabs: NgbTabset;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _clienteService: ClienteService,
        private _ls: LocalStorageService,
        private location: Location,
        toasterService: ToasterService,
        configPop: NgbPopoverConfig
    ) {
        this.clientes = [];
        this.cliente = new Cliente(null, null, [], null, null, false, [], false);
        this.toasterService = toasterService;
        this.token = this._ls.get('restouchusr').token;
        this.filtroCliente = null;
        this.idcliente = null;
        this.paginaActual = 1;
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({positionClass: 'toast-bottom-full-width'});

    private loadListaClientes(pagina?: number, buscar?: String) {
        this._clienteService.listaClientes(this.token, pagina, buscar).subscribe(
            response => {
                this.clientes = response.lista;
                this.paginaActual = +response.current;
                this.totalPaginas = +response.pages;
                this.totalItems = +response.conteo;
                this.perpage = +response.perpage;
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    pageChange() {
        this.loadListaClientes(this.paginaActual, this.filtroCliente);
    }

    ngOnInit() { this.loadListaClientes(); }

    ngAfterViewChecked() {
        setTimeout(() => {
            this._route.params.subscribe(params => {
                if (params['idcliente'] && !this.idcliente) {
                    this.idcliente = params['idcliente'];
                    if (this.tabs) {
                        this.mantenimientoCliente(null, { _id: this.idcliente });
                        this.tabs.select('tabCliente');
                        this.location.replaceState('clientes');
                    }
                }
            });
        });
    }

    refreshListaClientes() { this.loadListaClientes(); }

    private loadListaTelefonosCliente(idcliente) {
        this._clienteService.getTelefonosCliente(idcliente, this.token).subscribe(
            responseTel => {
                this.telefonosCliente = responseTel.lista;
            },
            errorTel => {
                const respuesta = JSON.parse(errorTel._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadListaDireccionesCliente(idcliente) {
        this._clienteService.getDireccionesCliente(idcliente, this.token).subscribe(
            responseDir => {
                this.direccionesCliente = responseDir.lista;
            }, errorDir => {
                const respuesta = JSON.parse(errorDir._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadListaDatosFacturaCliente(idcliente) {
        this._clienteService.getDatosFacturaCliente(idcliente, this.token).subscribe(
            response => {
                this.datosFacturaCliente = response.lista;
            }, error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    mantenimientoCliente(ts, objCliente) {
        this._clienteService.getClienteById(objCliente._id, this.token).subscribe(
            response => {
                response.entidad.cumpleanios = moment(response.entidad.cumpleanios, 'YYYY-MM-DD').utc().format('YYYY-MM-DD');
                this.cliente = response.entidad;
                this.loadListaTelefonosCliente(objCliente._id);
                this.loadListaDireccionesCliente(objCliente._id);
                this.loadListaDatosFacturaCliente(objCliente._id);
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
        if (ts) { ts.select('tabCliente'); }
    }
}
