import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DecimalPipe } from '@angular/common';
// Modelos
import { Cliente } from '../../models/cliente';
import { TelefonoCliente } from '../../models/telefonocliente';
import { DireccionCliente } from '../../models/direccioncliente';
import { DatoFacturaCliente } from '../../models/datosfactcliente';
import { Comanda } from '../../models/comanda';
import { TipoDireccion } from '../../models/tipodireccion';
import { Restaurante } from '../../models/restaurante';
// Servicios
import { GLOBAL, EstatusComanda } from '../../services/global';
import { ClienteService } from '../../services/cliente.service';
import { ComandaService } from '../../services/comanda.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { TipoDireccionService } from '../../services/tipodireccion.service';
import { RestauranteService } from '../../services/restaurante.service';
import { MintService } from '../../services/mint.service';
import { GoogleApiService } from '../../services/gapi.service';
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// Otros
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import * as moment from 'moment';
import { MomentModule } from 'angular2-moment';
import 'moment/locale/es';

@Component({
    selector: 'app-lista-comandas',
    templateUrl: './lstcomandas.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ClienteService, LocalStorageService, ComandaService, TipoDireccionService, RestauranteService, MintService, GoogleApiService
    ],
    styles: [`.modal-size .modal-content { width: 600px }`]
})
export class ListaComandasComponent implements OnInit, OnDestroy {
    public telABuscar: string;
    public listaClientes: Array<Cliente>;
    public listaComandas: Array<Comanda>;
    public comandaSelected: Comanda;
    public contadores: Array<any>;
    public filtroCliente: string;
    public fdel: string;
    public fal: string;
    public clienteNuevo: Cliente;
    public telefonoNuevo: TelefonoCliente;
    public direccionNueva: DireccionCliente;
    public facturaNueva: DatoFacturaCliente;
    public tiposDireccion: Array<TipoDireccion>;
    public restaurantes: Array<Restaurante>;
    public mintOrders: Array<any>;
    private token: string;
    private toasterService: ToasterService;
    private idclienteSelected: string;
    private resumenCobro: Array<any>;
    private repetidor;
    private restaurantesUsuario: Array<string>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _clienteService: ClienteService,
        private _ls: LocalStorageService,
        private _comandaService: ComandaService,
        private _tipoDireccionService: TipoDireccionService,
        private _restauranteService: RestauranteService,
        private _mintService: MintService,
        private _gapiService: GoogleApiService,
        private modalService: NgbModal,
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;
        this.telABuscar = null;
        this.token = this._ls.get('restouchusr').token;
        this.idclienteSelected = null;
        this.listaComandas = [];
        this.comandaSelected = new Comanda(
            null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, [], [], [], null, null, null, null, [], null, null, false
        );
        this.resumenCobro = [];
        this.contadores = [];
        this.filtroCliente = null;
        this.fdel = moment().format('YYYY-MM-DD');
        // this.fdel = moment('2018-04-26').format('YYYY-MM-DD');
        this.fal = moment().format('YYYY-MM-DD');
        this.restaurantesUsuario = [];
        this.mintOrders = [];
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({ positionClass: 'toast-bottom-full-width' });

    public loadComandas(idestatus: string = '') {
        const fdstr = moment(this.fdel).format('YYYY-MM-DD');
        const fastr = moment(this.fal).format('YYYY-MM-DD');
        this._comandaService.listaComandas(this.token, idestatus, fdstr, fastr).subscribe(
            result => {
                if (result.lista) {
                    this.listaComandas = result.lista;
                } else {
                    this.listaComandas = [];
                    // this.toasterService.pop('info', 'Información', 'Información: ' + result.mensaje);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    public loadComandasEnhanced(idestatus: string = '') {
        this._mintService.listaPedidos(
            this.token, moment(this.fdel).format('YYYY-MM-DD'), moment(this.fal).format('YYYY-MM-DD')
        ).subscribe(
            resMint => {
                this._mintService.crearPedidos(resMint.lista, this.token).then((res) => {
                    if (this.restaurantesUsuario.length > 0) { this.restaurantesUsuario = []; }
                    this._ls.get('restouchusr').restaurante.forEach((rst) => { this.restaurantesUsuario.push(rst._id); });
                    const parametros = {
                        fdel: moment(this.fdel).format('YYYY-MM-DD'),
                        fal: moment(this.fal).format('YYYY-MM-DD'),
                        idestatuscomanda: idestatus,
                        restaurantes: this.restaurantesUsuario
                    };

                    this._comandaService.listaComandasPost(this.token, parametros).subscribe(
                        result => {
                            if (result.lista) {
                                this.listaComandas = result.lista;
                            } else {
                                this.listaComandas = [];
                            }
                        },
                        error => {
                            const respuesta = JSON.parse(error._body);
                            this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                        }
                    );
                });
            },
            errMint => {
                try {
                    const respuesta = JSON.parse(errMint._body);
                    this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                }catch (e) {
                }
            }
        );
    }

    public loadContadores() {
        const fdstr = moment(this.fdel).format('YYYY-MM-DD');
        const fastr = moment(this.fal).format('YYYY-MM-DD');
        this._comandaService.contadorPorEstatus(this.token, fdstr, fastr).subscribe(
            result => {
                if (result.lista) {
                    this.contadores = result.lista;
                    // console.log(this.contadores);
                } else {
                    this.contadores = [];
                    // this.toasterService.pop('info', 'Información', 'Información: ' + result.mensaje);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadTiposDireccion() {
        this._tipoDireccionService.listaTiposDeDireccion(this.token).subscribe(
            response => {
                this.tiposDireccion = response.lista;
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadRestaurantes() {
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

    private resetClienteNuevo() {
        this.clienteNuevo = new Cliente(null, null, [], null, null, null, [], false);
        this.telefonoNuevo = new TelefonoCliente(null, null, this.telABuscar.trim(), false);
        this.direccionNueva = new DireccionCliente(null, null, null, null, null, null, null, null, false);
        this.facturaNueva = new DatoFacturaCliente(null, null, null, null, null, false);
    }

    ngOnInit() {
        this.loadComandasEnhanced();
        // this.loadContadores();
        this.repetidor = Observable.interval(1000 * 10).subscribe(tick => {
            this.loadComandasEnhanced();
            // this.loadContadores();
        });
    }

    ngOnDestroy() {
        this.repetidor.unsubscribe();
        // console.log('Timer detenido...');
    }

    private clienteNoEncontrado(modalNuevoCliente) {
        this.resetClienteNuevo();
        this.loadTiposDireccion();
        this.loadRestaurantes();
        this.modalService.open(modalNuevoCliente, { windowClass: 'modal-size' }).result.then(
            result => {
                this._clienteService.crearPaqueteCliente(
                    this.clienteNuevo, this.telefonoNuevo, this.direccionNueva, this.facturaNueva, this.token
                ).subscribe(
                    response => {
                        if (response.entidad) {
                            this._router.navigate(['/comanda', response.entidad.idcliente, response.entidad.telefono]);
                        } else {
                            this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                        }
                    },
                    error => {
                        const respuesta = JSON.parse(error._body);
                        this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                    });
            },
            reason => { }
        );
    }

    buscarCliente(modalSelCliente, modalNuevoCliente) {
        document.getElementById('srchCli').blur();
        this._clienteService.getClienteByTelefono(this.telABuscar, this.token).subscribe(
            response => {
                if (response.lista) {
                    this.listaClientes = response.lista;
                    if (this.listaClientes.length === 1) {
                        this._router.navigate(['/comanda', this.listaClientes[0]._id, this.telABuscar]);
                    } else if (this.listaClientes.length > 1) {
                        this.modalService.open(modalSelCliente).result.then(
                            result => {
                                this._router.navigate(['/comanda', result, this.telABuscar]);
                            },
                            reason => {
                                // console.log(reason);
                            }
                        );
                    }
                } else {
                    this.toasterService.pop('info', 'Clientes', response.mensaje);
                    this.clienteNoEncontrado(modalNuevoCliente);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    verDetCobro(cmd, modalDetCobroComanda) {
        this.comandaSelected = cmd;
        this.resumenCobro = [];
        this.comandaSelected.detcobrocomanda.forEach(item => {
            let tmpTot = 0.00;
            item.detcobro.forEach(element => { tmpTot += element.monto; });
            this.resumenCobro.push(
                {
                    descripcion: item.descripcion,
                    monto: tmpTot,
                    imagen: '../../../assets/' + (item.estarjeta ? 'tarjeta' : 'efectivo') + '.png'
                }
            );
        });

        this.modalService.open(modalDetCobroComanda, { windowClass: 'modal-size' }).result.then(
            result => { },
            reason => { }
        );

    }

    nuevoPedido(modalNuevoPedido) {
        this.modalService.open(modalNuevoPedido).result.then(
            result => {
                // console.log(result);
                this.clienteNuevo = new Cliente(null, result, [], null, null, false, [], false);
                this._clienteService.crear(this.clienteNuevo, this.token).subscribe(
                    response => {
                        if (response.entidad) {
                            this._router.navigate(['/comanda', response.entidad._id]);
                        } else {
                            this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                        }
                    },
                    error => {
                        const respuesta = JSON.parse(error._body);
                        this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                    }
                );
            },
            reason => {}
        );
    }

    goToUrl(obj: any) {
        this._router.navigate(['/comanda', obj.idcliente._id, '', 0, obj._id ]);
    }

    printComanda(trackingNo: number, idcomanda: string) {
        this._gapiService.updGoogleToken().subscribe(
            respUpd => {
                this._gapiService.print(trackingNo, this.token).subscribe(
                    respPrint => {
                        this.toasterService.pop('info', 'Imprimiendo', 'Imprimiendo Orden No: ' + trackingNo);
                        this._router.navigate(['/comandas']);
                    },
                    errorPrint => {
                        const respuesta = JSON.parse(errorPrint._body);
                        this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                    },
                    () => {
                        this._comandaService.cambiarEstatus(idcomanda, EstatusComanda.Produccion).subscribe(
                            resUpdEst => { }, errUpdEst => { }
                        );
                    }
                );
            },
            errUpd => {
                const respuesta = JSON.parse(errUpd._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }
}
