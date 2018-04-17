import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { Cliente } from '../../models/cliente';
import { TelefonoCliente } from '../../models/telefonocliente';
import { DireccionCliente } from '../../models/direccioncliente';
import { TipoDireccion } from '../../models/tipodireccion';
import { Restaurante } from '../../models/restaurante';
import { DatoFacturaCliente } from '../../models/datosfactcliente';
import { NotasCliente } from '../../models/notascliente';
import { RangoEdades } from '../../models/rangoedades';

// Servicios
import { GLOBAL } from '../../services/global';
import { ClienteService } from '../../services/cliente.service';
import { TipoDireccionService } from '../../services/tipodireccion.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { RestauranteService } from '../../services/restaurante.service';

// Otros
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import * as moment from 'moment';

@Component({
    selector: 'app-mnt-cliente',
    templateUrl: './cliente.component.html',
    providers: [ ClienteService, LocalStorageService, TipoDireccionService, RestauranteService ]
})
export class ClienteComponent implements OnInit {
    @Input() cliente: Cliente;
    @Input() desdePopOver: Boolean = false;
    @Input() telefonosCliente: TelefonoCliente[];
    @Input() direccionesCliente: DireccionCliente[];
    @Input() datosfactCliente: DatoFacturaCliente[];
    private toasterService: ToasterService;
    private token: String;
    public telefonoCliente: TelefonoCliente;
    public direccionCliente: DireccionCliente;
    public datofactCliente: DatoFacturaCliente;
    private editandoTelefonoCliente: boolean;
    private editandoDireccionCliente: boolean;
    private editandoDatoFacturaCliente: boolean;
    private editandoNotasCliente: boolean;
    private tiposDireccion: TipoDireccion[];
    private restaurantes: Restaurante[];

    @Output() refrescaListaClientes = new EventEmitter();

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _clienteService: ClienteService,
        private _ls: LocalStorageService,
        private _tipoDireccionService: TipoDireccionService,
        private _restauranteService: RestauranteService,
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;
        this.token = this._ls.get('restouchusr').token;
        this.editandoTelefonoCliente = false;
        this.editandoDireccionCliente = false;
        this.editandoDatoFacturaCliente = false;
        this.editandoNotasCliente = false;
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({positionClass: 'toast-bottom-full-width'});

    ngOnInit() {
        // console.log('login.component cargado...');
        if (this.desdePopOver) {
            this.cliente = new Cliente(null, null, [], null, null, false, [], false);
            this.telefonoCliente = new TelefonoCliente(null, null, null, false);
            this.direccionCliente = new DireccionCliente(null, null, null, null, null, null, null, null, false);
            this.datofactCliente = new DatoFacturaCliente(null, null, null, null, null, false);
        } else {
            this.telefonoCliente = new TelefonoCliente(null, this.cliente._id, null, false);
            this.direccionCliente = new DireccionCliente(null, this.cliente._id, null, null, null, null, null, null, false);
            this.datofactCliente = new DatoFacturaCliente(null, this.cliente._id, null, null, null, false);
            this._tipoDireccionService.listaTiposDeDireccion(this.token).subscribe(
                response => {
                    this.tiposDireccion = response.lista;
                },
                error => {
                    const respuesta = JSON.parse(error._body);
                    this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                }
            );
            this._restauranteService.listaRestaurantes(this.token).subscribe(
                response => {
                    this.restaurantes = response.lista;
                },
                error => {
                    const respuesta = JSON.parse(error._body);
                    this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                }
            );
        }
    }

    onSubmit() {
        this._clienteService.crear(this.cliente, this.token).subscribe(
            response => {
                this.cliente = response.entidad;
                this.refrescaListaClientes.emit();
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    closePopOver() { this.refrescaListaClientes.emit(); }

    updCliente() {
        this._clienteService.modificar(this.cliente, this.token).subscribe(
            response => {
                if (response.entidad) {
                    response.entidad.cumpleanios = moment(response.entidad.cumpleanios, 'YYYY-MM-DD').utc().format('YYYY-MM-DD');
                    this.cliente = response.entidad;
                    this.refrescaListaClientes.emit();
                    this.editandoNotasCliente = false;
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

    //#region Telefonos
    nuevoTelefono() {
        this.telefonoCliente = new TelefonoCliente(null, this.cliente._id, null, false);
        this.editandoTelefonoCliente = true;
    }

    cancelNuevoTelefono() {
        this.telefonoCliente = new TelefonoCliente(null, this.cliente._id, null, false);
        this.editandoTelefonoCliente = false;
    }

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

    onSubmitTelCli() {
        this._clienteService.crearTelefono(this.telefonoCliente, this.token).subscribe(
            response => {
                this.loadListaTelefonosCliente(this.cliente._id);
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
        this.editandoTelefonoCliente = false;
    }

    getTelefonoCli(identidad) {
        this._clienteService.getTelefonoCliente(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.telefonoCliente = response.entidad;
                    this.editandoTelefonoCliente = true;
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

    updTelefonoCli() {
        this._clienteService.modificarTelefonoCliente(this.telefonoCliente, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.cancelNuevoTelefono();
                    this.loadListaTelefonosCliente(this.cliente._id);
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

    delTelefonoCli(identidad) {
        this._clienteService.eliminarTelefonoCliente(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.cancelNuevoTelefono();
                    this.loadListaTelefonosCliente(this.cliente._id);
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
    //#endregion

    //#region Direcciones
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

    nuevaDireccion() {
        this.direccionCliente = new DireccionCliente(null, this.cliente._id, null, null, null, null, null, null, false);
        this.editandoDireccionCliente = true;
    }

    cancelNuevaDireccion() {
        this.direccionCliente = new DireccionCliente(null, this.cliente._id, null, null, null, null, null, null, false);
        this.editandoDireccionCliente = false;
    }

    onSubmitDirCli() {
        this._clienteService.crearDireccion(this.direccionCliente, this.token).subscribe(
            response => {
                this.loadListaDireccionesCliente(this.cliente._id);
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
        this.editandoDireccionCliente = false;
    }

    getDirCliente(iddir) {
        this._clienteService.getDireccionCliente(iddir, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.direccionCliente = response.entidad;
                    this.editandoDireccionCliente = true;
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

    updDirCliente() {
        this._clienteService.modificarDireccionCliente(this.direccionCliente, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.editandoDireccionCliente = false;
                    this.direccionCliente = new DireccionCliente(null, this.cliente._id, null, null, null, null, null, null, false);
                    this.loadListaDireccionesCliente(this.cliente._id);
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

    delDirCliente(iddir) {
        this._clienteService.eliminarDireccionCliente(iddir, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadListaDireccionesCliente(this.cliente._id);
                    this.cancelNuevaDireccion();
                } else {
                    this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                    this.cancelNuevaDireccion();
                }

            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    //#endregion

    //#region Datos de facturación
    private loadListaDatosFacturaCliente(idcliente) {
        this._clienteService.getDatosFacturaCliente(idcliente, this.token).subscribe(
            response => {
                this.datosfactCliente = response.lista;
            }, error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    nuevoDatoFactura() {
        this.datofactCliente = new DatoFacturaCliente(null, this.cliente._id, null, null, null, false);
        this.editandoDatoFacturaCliente = true;
    }

    cancelNuevoDatoFactura() {
        this.datofactCliente = new DatoFacturaCliente(null, this.cliente._id, null, null, null, false);
        this.editandoDatoFacturaCliente = false;
    }

    onSubmitDatoFactura() {
        this._clienteService.crearDatoFacturaCliente(this.datofactCliente, this.token).subscribe(
            response => {
                this.loadListaDatosFacturaCliente(this.cliente._id);
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
        this.editandoDatoFacturaCliente = false;
    }

    getDatoFactura(identidad) {
        this._clienteService.getDatoFacturaCliente(identidad, this.token).subscribe(
            response => {
                if ( response.entidad ) {
                    this.datofactCliente = response.entidad;
                    this.editandoDatoFacturaCliente = true;
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

    updDatoFactura() {
        this._clienteService.modificarDatoFacturaCliente(this.datofactCliente, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.cancelNuevoDatoFactura();
                    this.loadListaDatosFacturaCliente(this.cliente._id);
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

    delDatoFactura(identidad) {
        this._clienteService.eliminarDatoFacturaCliente(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.cancelNuevoDatoFactura();
                    this.loadListaDatosFacturaCliente(this.cliente._id);
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
    //#endregion

    //#region Notas del cliente
    addNotaCliente() {
        this.editandoNotasCliente = true;
        if (!this.cliente.notascliente ) { this.cliente.notascliente = []; }
        this.cliente.notascliente.push( new NotasCliente(moment().toDate(), null, false));

    }

    delNotaCliente(i) {
        this.editandoNotasCliente = false;
        this.cliente.notascliente.splice(i, 1);
    }
    //#endregion

    //#region Rango de edades
    nuevoRangoEdades() {
        if (!this.cliente.rangoedadeshijos) { this.cliente.rangoedadeshijos = []; }
        this.cliente.rangoedadeshijos.push( new RangoEdades(null, null, false) );
    }

    delRangoEdad(i) {
        this.cliente.rangoedadeshijos.splice(i, 1);
    }
    //#endregion

    goToComandaHisto(telefono) {
        this._router.navigate(['/comanda', this.cliente._id, telefono, 1]);
    }


}
