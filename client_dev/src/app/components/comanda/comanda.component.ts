import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DecimalPipe } from '@angular/common';

// Modelos
import { Cliente } from '../../models/cliente';
import { TelefonoCliente } from '../../models/telefonocliente';
import { DireccionCliente } from '../../models/direccioncliente';
import { TipoDireccion } from '../../models/tipodireccion';
import { Restaurante } from '../../models/restaurante';
import { DatoFacturaCliente } from '../../models/datosfactcliente';
import { MenuRestaurante } from '../../models/menurest';
import { MenuRestComponente } from '../../models/menurestcomponente';
import { Comanda } from '../../models/comanda';
import { DetalleComanda } from '../../models/detallecomanda';
import { DetalleComponenteDetalleComanda } from '../../models/detcompdetcomanda';
import { ExtrasNotasComanda } from '../../models/extrasnotascomanda';
import { Componente } from '../../models/componente';
import { FormaPago } from '../../models/formapago';
import { DetalleCobroComanda } from '../../models/detcobrocomanda';
import { DetalleCobro } from '../../models/detcobro';
import { EmisorTarjeta } from '../../models/emisortarjeta';
import { DetalleFacturarA } from '../../models/detfacturara';
import { TipoComanda } from '../../models/tipocomanda';
import { Banner } from '../../models/banner';
import { Vuelto } from '../../models/vuelto';
import { RazonCortesia } from '../../models/razoncortesia';
import { TiempoEntrega } from '../../models/tiempoentrega';

// Servicios
import { GLOBAL, EstatusComanda } from '../../services/global';
import { ClienteService } from '../../services/cliente.service';
import { TipoDireccionService } from '../../services/tipodireccion.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { RestauranteService } from '../../services/restaurante.service';
import { MenuRestauranteService } from '../../services/menurest.service';
import { MenuRestComponenteService } from '../../services/menurestcomponente.service';
import { ComponenteService } from '../../services/componente.service';
import { FormaPagoService } from '../../services/formapago.service';
import { EmisorTarjetaService } from '../../services/emisortarjeta.service';
import { ComandaService } from '../../services/comanda.service';
import { TipoComandaService } from '../../services/tipocomanda.service';
import { BannerService } from '../../services/banner.service';
import { VueltoService } from '../../services/vuelto.service';
import { RazonCortesiaService } from '../../services/razoncortesia.service';
import { TiempoEntregaService } from '../../services/tiempoentrega.service';
import { GoogleApiService } from '../../services/gapi.service';


// Otros
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster';
import * as moment from 'moment';

@Component({
    selector: 'app-comanda',
    templateUrl: './comanda.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        ClienteService, LocalStorageService, TipoDireccionService, RestauranteService, MenuRestauranteService,
        MenuRestComponenteService, ComponenteService, FormaPagoService, EmisorTarjetaService, ComandaService,
        TipoComandaService, BannerService, VueltoService, RazonCortesiaService, TiempoEntregaService, GoogleApiService
    ],
    styles: [`.modal-size .modal-content { width: 850px } .modal-size-pago .modal-content { width: 850px }`]
})
export class ComandaComponent implements OnInit {
    public clienteObj: Cliente;
    public telefonosCliente: Array<TelefonoCliente>;
    public direccionesCliente: Array<DireccionCliente>;
    public datosfactCliente: Array<DatoFacturaCliente>;
    public detallesComponente: Array<DetalleComponenteDetalleComanda>;
    public extrasNotas: Array<ExtrasNotasComanda>;
    public telefonoClienteObj: TelefonoCliente;
    public telCli: TelefonoCliente;
    public direccionClienteObj: DireccionCliente;
    public direccionClienteNueva: DireccionCliente;
    public datofactClienteObj: DatoFacturaCliente;
    public detcompo: DetalleComponenteDetalleComanda;
    public extra: ExtrasNotasComanda;
    public carta: Array<any>;
    public comanda: Comanda;
    public detalleComanda: Array<DetalleComanda>;
    public detcom: DetalleComanda;
    public detallescobcom: Array<DetalleCobroComanda>;
    public detcobcom: DetalleCobroComanda;
    public detscobro: Array<DetalleCobro>;
    public detcobro: DetalleCobro;
    public histoCliente: Array<Comanda>;
    public lstTiposComanda: Array<TipoComanda>;
    public bans: Array<Banner>;
    public vlts: Array<Vuelto>;
    public rcorts: Array<RazonCortesia>;
    public tiempos: Array<TiempoEntrega>;
    public lblTipoComanda: string;
    public eshistorica: boolean;
    public restaurantes: Array<Restaurante>;
    private toasterService: ToasterService;
    private token: string;
    private tiposDireccion: Array<TipoDireccion>;
    private componentesItemMenu: Array<MenuRestComponente>;
    private lstComposExtras: Array<Componente>;
    private lstFormasPago: Array<FormaPago>;
    private lstEmisoresTarjeta: Array<EmisorTarjeta>;
    private idxDetCom: number;
    private idxDetSel: number;
    private idxCompoSel: number;
    private parametros = { idcliente: null, telefono: null, idcomanda: null };
    private saldocomanda: number;
    private porcpend: number;
    private saldofacta: number;
    private nivelActual: number;
    private comandaOriginal: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _clienteService: ClienteService,
        private _ls: LocalStorageService,
        private _tipoDireccionService: TipoDireccionService,
        private _restauranteService: RestauranteService,
        private _menuRestauranteService: MenuRestauranteService,
        private _menuRestCompoService: MenuRestComponenteService,
        private _componenteService: ComponenteService,
        private _formaPagoService: FormaPagoService,
        private _emisorTarjetaService: EmisorTarjetaService,
        private _comandaService: ComandaService,
        private _tipoComandaService: TipoComandaService,
        private _bannerService: BannerService,
        private _vueltoService: VueltoService,
        private _razonCortesiaService: RazonCortesiaService,
        private _tiempoEntregaService: TiempoEntregaService,
        private _gapiService: GoogleApiService,
        private modalService: NgbModal,
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;
        this.token = this._ls.get('restouchusr').token;
        this.parametros = { idcliente: null, telefono: null, idcomanda: null };
        this.clienteObj = new Cliente(null, null, [], null, null, false, [], false);
        this.telefonoClienteObj = new TelefonoCliente(null, null, null, false);
        this.direccionClienteObj = new DireccionCliente(null, null, null, null, null, null, null, null, false);
        this.carta = new Array();
        this.comanda = new Comanda(
            null, null, null, null, null, null, null, null, null, null, null,
            null, 0, 0, [], [], [], null, null, null, null, [], null, null, false
        );
        this.detalleComanda = [];
        this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false);
        this.detcompo = new DetalleComponenteDetalleComanda(null, null, [], false);
        this.extra = new ExtrasNotasComanda(null, false, null, null, null, false);
        this.detallesComponente = [];
        this.extrasNotas = [];
        this.lstComposExtras = [];
        this.idxDetCom = null;
        this.idxDetSel = null;
        this.idxCompoSel = null;
        this.lstFormasPago = [];
        this.lstEmisoresTarjeta = [];
        this.lstTiposComanda = [];
        this.detallescobcom = [];
        this.detcobcom = new DetalleCobroComanda(null, null, false, [], false, false, false);
        this.detscobro = [];
        this.detcobro = new DetalleCobro(
            null, null, null, null, null, false, null, null, null, null, null, false, null, false, null, false
        );
        this.saldocomanda = 0.00;
        this.porcpend = 0.00;
        this.lblTipoComanda = '';
        this.histoCliente = [];
        this.vlts = [];
        this.rcorts = [];
        this.tiempos = [];
        this.restaurantes = [];
        this.eshistorica = false;
        this.datofactClienteObj = new DatoFacturaCliente(null, null, null, null, null, false);
        this.direccionClienteNueva = new DireccionCliente(null, null, null, null, null, null, null, null, false);
        this.nivelActual = 0;
        this.telefonosCliente = [];
        this.telCli = new TelefonoCliente(null, null, null, false);
        this.comandaOriginal = {};
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({ positionClass: 'toast-bottom-full-width' });

    private loadDireccionesCliente(asignar: boolean = true) {
        this._clienteService.getDireccionesCliente(this.comanda.idcliente, this.token).subscribe(
            response => {
              if (response.lista) {
                  this.direccionesCliente = response.lista;
                  // console.log('Direcciones: ', this.direccionesCliente);
                  if (asignar && this.direccionesCliente.length > 0) {
                      this.direccionClienteObj = this.direccionesCliente[0];
                      this.comanda.iddireccioncliente = this.direccionClienteObj._id;
                      this.comanda.idrestaurante = response.lista[0].idrestaurante ? response.lista[0].idrestaurante._id : null;
                  }
              }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadTelefonosCliente() {
        this._clienteService.getTelefonosCliente(this.comanda.idcliente, this.token).subscribe(
            response => {
                this.telefonosCliente = response.lista;
                // console.log(this.telefonosCliente);
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadComponentesItemMenu(idmnurest: string) {
        this._menuRestCompoService.listaMenuRestComponente(this.token, idmnurest).subscribe(
            response => {
                if (response.lista) {
                    this.componentesItemMenu = response.lista;
                    // console.log(this.componentesItemMenu);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadExtras() {
        this._componenteService.listaExtras(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.lstComposExtras = response.lista;
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadFormasPago () {
        this._formaPagoService.listaFormasPago(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.lstFormasPago = response.lista;
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadEmisoresTarjeta() {
        this._emisorTarjetaService.listaEmisoresTarjeta(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.lstEmisoresTarjeta = response.lista;
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadDatosFactCliente(asignar: boolean = true) {
        this._clienteService.getDatosFacturaCliente(this.comanda.idcliente, this.token).subscribe(
            response => {
                if (response.lista) {
                    this.datosfactCliente = response.lista;
                    if (asignar) {
                        this.comanda.detfacturara.push(
                            new DetalleFacturarA(
                                this.datosfactCliente[0].nombre,
                                this.datosfactCliente[0].nit,
                                this.datosfactCliente[0].direccion,
                                this.comanda.totalcomanda
                            )
                        );
                    }
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadTiposComanda() {
        this._tipoComandaService.listaTiposComanda(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.lstTiposComanda = response.lista;
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadHistorial() {
        this._comandaService.histoComandasCliente(this.token, this.comanda.idcliente).subscribe(
            response => {
                if (response.lista) {
                    response.lista.forEach((histo) => {
                        histo.fecha = moment(histo.fecha).format('YYYY-MM-DD HH:mm:ss');
                    });
                    this.histoCliente = response.lista;
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadBanners() {
        this._bannerService.listaBannersFecha(this.token).subscribe(
            response => {
                if (response.lista) {
                    response.lista.forEach((item) => {
                        if (!item.espermanente) {
                            item.fechadel = moment(item.fechadel).format('YYYY-MM-DD');
                            item.fechaal = moment(item.fechaal).format('YYYY-MM-DD');
                        }
                    });
                    this.bans = response.lista;
                    // console.log(this.bans);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadVueltos(monto: number) {
        this._vueltoService.vueltosMayoresQue(this.token, monto).subscribe(
            response => {
                if (response.lista) {
                    this.vlts = response.lista;
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadRazonesCortesia() {
        this._razonCortesiaService.listaRazonesCortesia(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.rcorts = response.lista;
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadTiemposEntrega() {
        this._tiempoEntregaService.listaTiemposEntrega(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.tiempos = response.lista;
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

    private loadRestaurantes(idToSet: string = null) {
        this._restauranteService.listaRestaurantes(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.restaurantes = response.lista;
                    if (idToSet) {
                        this.comanda.idrestaurante = idToSet;
                    }
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

    private loadTiposDireccion() {
        this._tipoDireccionService.listaTiposDeDireccion(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.tiposDireccion = response.lista;
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

    private cleanVars() {
        this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false);
        this.carta.splice(1);
    }

    ngOnInit() {

        this._route.params.subscribe(params => {
            if (params['idcomanda']) {
                this.parametros.idcomanda = params['idcomanda'];
                this._comandaService.getComanda(this.parametros.idcomanda, this.token).subscribe(
                    response => {
                        if (response.entidad) {
                            this.comandaOriginal = response.entidad;
                            // console.log('Comanda existente: ', this.comandaOriginal);
                            // this.loadTiposComanda();
                            // this.loadTiemposEntrega();
                            this.loadRestaurantes(this.comandaOriginal.idrestaurante);
                            // this.loadTiposDireccion();
                            this.setTipoComanda(this.comandaOriginal.idtipocomanda);
                            this.comanda.detallecomanda = this.comandaOriginal.detallecomanda;
                            this.detalleComanda = this.comanda.detallecomanda;
                            this.calculaTotales();
                            this.comanda._id = this.comandaOriginal._id;
                            this.comanda.idestatuscomanda = this.comandaOriginal.idestatuscomanda.idestatuscomanda;
                        }
                    },
                    error => {
                        const respuesta = JSON.parse(error._body);
                        this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                    }
                );
            }

            if (params['idcliente']) {
                this.parametros.idcliente = params['idcliente'];
                this._clienteService.getClienteById(this.parametros.idcliente, this.token).subscribe(
                    response => {
                        if ( !response.entidad ) {
                            this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                        } else {
                            this.clienteObj = response.entidad;
                            // console.log(this.clienteObj);
                            this.comanda.fecha = !this.eshistorica ? moment().toDate() : null;
                            this.comanda.idcliente = this.clienteObj._id;
                            this.comanda.fechainitoma = moment().toDate();
                            this.comanda.idusuario = this._ls.get('restouchusr')._id;
                            // this.loadTelefonosCliente();
                            // this.loadDireccionesCliente();
                            // this.loadDatosFactCliente();
                            this.loadTiposComanda();
                            // this.loadHistorial();
                            this.loadTiemposEntrega();
                            if (!this.parametros.idcomanda) { this.loadRestaurantes(); }
                            // this.loadTiposDireccion();
                        }
                    },
                    error => {
                        const respuesta = JSON.parse(error._body);
                        this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                    }
                );
            }

            if (params['telefono']) {
                this.parametros.telefono = params['telefono'];
                this._clienteService.getTelefonoClienteNumtel(this.parametros.idcliente, this.parametros.telefono, this.token).subscribe(
                    response => {
                        if (!response.entidad) {
                            this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                        } else {
                            this.telefonoClienteObj = response.entidad;
                            this.comanda.idtelefonocliente = this.telefonoClienteObj._id;
                        }
                    },
                    error => {
                        const respuesta = JSON.parse(error._body);
                        this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                    }
                );
            }

            if ( params['historica'] ) {
                this.eshistorica = +params['historica'] === 0 ? false : true;
            }

            // console.log('En memoria:', this.comanda);

            this.loadCarta(null, 0);
            this.loadBanners();
        });
    }

    cancelaPedido() {
        this.comanda = new Comanda(
            null, null, null, null, null, null, null, null, null, null,
            null, null, 0, 0, [], [], [], null, null, null, null, [], null, null, false
        );
        this._router.navigate(['/comandas']);
    }

    selectDireccionesCliente(modalSelDireccionCliente) {
        this.modalService.open(modalSelDireccionCliente, { windowClass: 'modal-size' }).result.then(
            result => {
                if (result) {
                    this.direccionClienteObj = result;
                    this.comanda.iddireccioncliente = this.direccionClienteObj._id;
                    this.comanda.idrestaurante = result.idrestaurante._id;
                }
            },
            reason => {
                // console.log(reason);
            }
        );
    }

    selectTelefonoCliente(modalSelTelefono) {
        this.modalService.open(modalSelTelefono).result.then(
            result => {
                if (result) {
                    this.telefonoClienteObj = result;
                    this.comanda.idtelefonocliente = this.telefonoClienteObj._id;
                }
            },
            reason => {
                // console.log(reason);
            }
        );
    }

    nuevaDireccionEntrega() {
        this.direccionClienteNueva.idcliente = this.comanda.idcliente;
        this._clienteService.crearDireccion(this.direccionClienteNueva, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.direccionClienteObj = response.entidad;
                    this.comanda.iddireccioncliente = this.direccionClienteObj._id;
                    this.comanda.idrestaurante = this.direccionClienteObj.idrestaurante;
                    this.direccionClienteNueva = new DireccionCliente(null, null, null, null, null, null, null, null, false);
                    this.loadDireccionesCliente(false);
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

    setFacturarA(modalSelFacturarA) {
        this.modalService.open(modalSelFacturarA, { windowClass: 'modal-size' }).result.then(
            result => {
                if (result) {
                    if (this.comanda.detfacturara && this.comanda.detfacturara.length > 0) {
                        this.comanda.detfacturara.splice(0);
                    }
                    this.comanda.detfacturara.push(
                        new DetalleFacturarA(result.nombre, result.nit, result.direccion, this.comanda.totalcomanda)
                    );
                }
            },
            reason => {
                // console.log(reason);
            }
        );
    }

    nuevoFacturarA() {
        this.datofactClienteObj.idcliente = this.comanda.idcliente;
        this._clienteService.crearDatoFacturaCliente(this.datofactClienteObj, this.token).subscribe(
            response => {
                if (response.entidad) {
                    if (this.comanda.detfacturara && this.comanda.detfacturara.length > 0) {
                        this.comanda.detfacturara.splice(0);
                    }
                    this.comanda.detfacturara.push(
                        new DetalleFacturarA(
                            response.entidad.nombre, response.entidad.nit, response.entidad.direccion, this.comanda.totalcomanda
                        )
                    );
                    this.datofactClienteObj = new DatoFacturaCliente(null, null, null, null, null, false);
                    this.loadDatosFactCliente(false);
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

    nuevoTelCli() {
        this.telCli.idcliente = this.comanda.idcliente;
        // console.log(this.telCli);
        this._clienteService.crearTelefono(this.telCli, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.telefonoClienteObj = response.entidad;
                    this.comanda.idtelefonocliente = this.telefonoClienteObj._id;
                    this.telCli = new TelefonoCliente(null, null, null, false);
                    this.loadTelefonosCliente();
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

    verHistorialCliente(modalHistorialCliente) {
        this.modalService.open(modalHistorialCliente, { windowClass: 'modal-size' }).result.then(
            result => {
                this.comanda.detallecomanda = result.detallecomanda;
                this.detalleComanda = this.comanda.detallecomanda;
                this.calculaTotales();
                // console.log(this.comanda);
            },
            reason => {
                // console.log(reason);
            }
        );
    }

    setTipoComanda(tcom) {
        this.comanda.idtipocomanda = tcom._id;
        this.lblTipoComanda = tcom.descripcion;
    }

    setDetTemp(nivel: number, itemMenu: MenuRestaurante) {
        if (nivel <= this.nivelActual) {
            const tmpdesc = this.detcom.descripcion.split('-');
            this.detcom.descripcion = '';
            for (let i = 0; i < nivel; i++) {
                if (this.detcom.descripcion !== '') { this.detcom.descripcion += '-'; }
                this.detcom.descripcion += tmpdesc[i] ? tmpdesc[i].trim() : '';
            }
        }
        this.nivelActual = nivel;

        if (nivel > 1) {
            if (this.detcom.descripcion !== '') { this.detcom.descripcion += '-'; }
            this.detcom.descripcion += itemMenu.descripcion;
        } else if (itemMenu) {
            this.detcom.descripcion = itemMenu.descripcion;
        }

        if (itemMenu && itemMenu.precio) { this.detcom.precio = itemMenu.precio; }
    }

    loadCarta(modalComponentes, nivel, idpadre = null, itemMenu: MenuRestaurante = null) {
        this._menuRestauranteService.getCarta(this.token, nivel, idpadre).subscribe(
            response => {
                if (response.lista) {
                    const tmp = [];
                    response.lista.forEach(element => {
                        tmp.push(element);
                    });
                    this.carta.splice(nivel);
                    this.carta.push(tmp);
                    this.setDetTemp(nivel, itemMenu);
                } else {
                    if (!itemMenu.espromocion) {
                        this.setDetTemp(nivel, itemMenu);
                        this.agregaADetalleComanda(itemMenu, this.detcom, modalComponentes);
                    } else {
                        // console.log(itemMenu);
                        this.addANotaPedido('Promoción: ' + itemMenu.descripcion);
                        const precioPromo = itemMenu.precio;
                        itemMenu.itemspromo.forEach((ip, i) => {
                            this.detalleComanda.push(
                                new DetalleComanda(
                                    ip.idmenurest, ip.cantidad, (i !== 0 ? 0 : precioPromo), null, ip.descripcion, [], [],
                                    ip.limitecomponentes, ip.tieneextras, ip.precioextra, false
                                )
                            );
                        });
                        this.calculaTotales();
                    }
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    pideComponentes(itemMenu: MenuRestaurante, detalleCom: DetalleComanda, modalComponentes) {
        this.loadComponentesItemMenu(itemMenu._id);
        this.modalService.open(modalComponentes).result.then(
            result => {
                this.cleanVars();
            },
            reason => { this.cleanVars(); }
        );
    }

    editaComponentes(dc, i, modalEditaComponentes) {
        this.detcom = dc;
        this.detcom.componentes = [];
        this.loadComponentesItemMenu(dc.idmenurest);
        this.modalService.open(modalEditaComponentes).result.then(
            result => { this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false); },
            reason => { this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false); }
        );
        /*if (dc.componentes && (dc.componentes.length > 0 || +dc.limitecomponentes > 0)) {
            this.detcom.componentes = [];
            this.loadComponentesItemMenu(dc.idmenurest);
            this.modalService.open(modalEditaComponentes).result.then(
                result => { this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false); },
                reason => { this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false); }
            );
        }*/
    }

    toggleComponente(e, obj) {
        this.detalleComanda[this.detalleComanda.length - 1].componentes.push(
            new DetalleComponenteDetalleComanda(obj._id, obj.descripcion, [], false)
        );
        /*
        if (e.target.checked) {
            this.detalleComanda[this.detalleComanda.length - 1].componentes.push(
                new DetalleComponenteDetalleComanda(obj._id, obj.descripcion, [], false)
            );
        } else {
            for (let i = 0; i < this.detalleComanda[this.detalleComanda.length - 1].componentes.length; i++) {
                if (this.detalleComanda[this.detalleComanda.length - 1].componentes[i].idcomponente === obj._id) {
                    this.detalleComanda[this.detalleComanda.length - 1].componentes.splice(i, 1);
                }
            }
        }
        */
    }

    toggleComponenteEdit(e, obj) {
        this.detcom.componentes.push(
            new DetalleComponenteDetalleComanda(obj._id, obj.descripcion, [], false)
        );
        /*
        if (e.target.checked) {
            this.detcom.componentes.push(
                new DetalleComponenteDetalleComanda(obj._id, obj.descripcion, [], false)
            );
        } else {
            for (let i = 0; i < this.detcom.componentes.length; i++) {
                if (this.detcom.componentes[i].idcomponente === obj._id) {
                    this.detcom.componentes.splice(i, 1);
                }
            }
        }
        */
    }

    pideExtras(modalExtras, idxdet, idxcompo) {
        this.idxDetSel = idxdet;
        this.idxCompoSel = idxcompo;
        this.loadExtras();
        this.modalService.open(modalExtras).result.then(
            result => {
                this.cleanVars();
            },
            reason => { this.cleanVars(); }
        );
    }

    pideExtrasProducto(modalExtrasProducto, idx) {
        this.idxDetCom = idx;
        this.loadExtras();
        this.modalService.open(modalExtrasProducto).result.then(
            result => { this.cleanVars(); },
            reason => { this.cleanVars(); }
        );
    }

    toggleExtras(e, extraItem) {
        if (e.target.checked) {
            this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].extrasnotas.push(
                new ExtrasNotasComanda(
                    extraItem._id, true,
                    extraItem.secobra ?
                    parseFloat((
                        this.detalleComanda[this.idxDetSel].precioextra / (this.detalleComanda[this.idxDetSel].limitecomponentes ?
                            this.detalleComanda[this.idxDetSel].limitecomponentes :
                            1)
                    ).toFixed(2)) : 0,
                    null, extraItem.descripcion, false
                )
            );
        } else {
            for (let i = 0; i < this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].extrasnotas.length; i++) {
                if (this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].extrasnotas[i].idcomponente === extraItem._id) {
                    this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].extrasnotas.splice(i, 1);
                }
            }
        }
        this.calculaTotales();
    }

    toggleExtrasProducto(e, extraItem) {
        if (e.target.checked) {
            if (!this.detalleComanda[this.idxDetCom].extrasnotas) { this.detalleComanda[this.idxDetCom].extrasnotas = []; }
            this.detalleComanda[this.idxDetCom].extrasnotas.push(
                new ExtrasNotasComanda(
                    extraItem._id, true,
                    extraItem.secobra ? this.detalleComanda[this.idxDetCom].precioextra : 0,
                    null, extraItem.descripcion, false
                )
            );
        } else {
            if (this.detalleComanda[this.idxDetCom].extrasnotas) {
                for (let i = 0; i < this.detalleComanda[this.idxDetCom].extrasnotas.length; i++) {
                    if (this.detalleComanda[this.idxDetCom].extrasnotas[i].idcomponente === extraItem._id) {
                        this.detalleComanda[this.idxDetCom].extrasnotas.splice(i, 1);
                    }
                }
            }
        }
        this.calculaTotales();
    }

    removeExtraNota(i, j, k) {
        this.detalleComanda[i].componentes[j].extrasnotas.splice(k, 1);
        this.calculaTotales();
    }

    addANotaPedido(texto: string) {
        if (texto != null && texto !== undefined && texto.trim() !== '') {
            if (this.comanda.notas == null || this.comanda.notas === undefined) { this.comanda.notas = ''; }
            if (this.comanda.notas !== '') { this.comanda.notas += '; '; }
            this.comanda.notas += texto.trim();
        }
    }

    pideNotas(modalNotas, idxdet, idxcompo) {
        this.idxDetSel = idxdet;
        this.idxCompoSel = idxcompo;
        if (!this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].extrasnotas) {
            this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].extrasnotas = [];
        }
        this.modalService.open(modalNotas).result.then(
            result => {
                this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].extrasnotas.push(
                    new ExtrasNotasComanda(null, false, null, result, null, false)
                );
                this.addANotaPedido(
                    this.detalleComanda[this.idxDetSel].descripcion + '-' +
                    this.detalleComanda[this.idxDetSel].componentes[this.idxCompoSel].descripcion + ': ' +
                    result
                );
                this.cleanVars();
            },
            reason => { this.cleanVars(); }
        );
    }

    pideNotasPedido(modalNotasPedido) {
        this.modalService.open(modalNotasPedido).result.then(
            result => { },
            reason => { }
        );
    }

    pideNotasProducto(modalNotasProducto, idxdet) {
        this.idxDetCom = idxdet;
        this.modalService.open(modalNotasProducto).result.then(
            result => {
                this.detalleComanda[this.idxDetCom].extrasnotas.push(
                    new ExtrasNotasComanda(null, false, null, result, null, false)
                );
                this.addANotaPedido(
                    this.detalleComanda[this.idxDetCom].descripcion + ': ' + result
                );
            },
            reason => { }
        );
    }

    agregaADetalleComanda(itemMenu: MenuRestaurante, detalleTemp: DetalleComanda, modalComponentes) {
        // console.log(itemMenu);
        this.detalleComanda.push(
            new DetalleComanda(
                itemMenu._id, 1, detalleTemp.precio, null, detalleTemp.descripcion, [], [],
                itemMenu.limitecomponentes, itemMenu.tieneextras, itemMenu.precioextra, false
            )
        );
        this.calculaTotales();
        if (itemMenu.tienecomponentes) {
            this.pideComponentes(itemMenu, this.detalleComanda[this.detalleComanda.length - 1], modalComponentes);
        } else { this.cleanVars(); }
    }

    removeItemPedido(idx: number) {
        this.detalleComanda.splice(idx, 1);
        this.calculaTotales();
    }

    removeExtraNotaProd(i, l) {
        this.detalleComanda[i].extrasnotas.splice(l, 1);
        this.calculaTotales();
    }

    calculaTotales() {
        this.comanda.cantidaditems = this.detalleComanda.length;
        this.comanda.totalcomanda = 0;
        if (this.detalleComanda) {
            this.detalleComanda.forEach(item => {
                this.comanda.totalcomanda += (item.cantidad * item.precio);
                if (item.extrasnotas) {
                    item.extrasnotas.forEach((en) => {
                        if (en.esextra && en.precio && en.precio !== 0) {
                            this.comanda.totalcomanda += (item.cantidad * en.precio);
                        }
                    });
                }
                if (item.componentes) {
                    item.componentes.forEach(compo => {
                        compo.extrasnotas.forEach(ext => {
                            if (ext.esextra && ext.precio && ext.precio !== 0) {
                                this.comanda.totalcomanda += (item.cantidad * ext.precio);
                            }
                        });
                    });
                }
            });
        }
        this.saldocomanda = this.comanda.totalcomanda;
        this.porcpend = 100.00;
        this.saldofacta = this.comanda.totalcomanda;
    }

    terminarPedido(modalPagar, modalConfirmEnd) {
        this.loadFormasPago();
        this.loadEmisoresTarjeta();
        // this.loadDatosFactCliente();
        this.loadRazonesCortesia();
        this.saldofacta = this.comanda.totalcomanda;
        if (this.comanda.detfacturara && this.comanda.detfacturara.length > 0) {
            this.comanda.detfacturara[0].monto = this.comanda.totalcomanda;
        }

        this.modalService.open(modalPagar, { windowClass: 'modal-size-pago' }).result.then(
            result => {
                this.comanda.detallecomanda = this.detalleComanda;
                this.comanda.detcobrocomanda = this.detallescobcom;
                this.modalService.open(modalConfirmEnd).result.then(
                    res => {
                        this.comanda.idestatuscomanda = '59fea7304218672b285ab0e2';
                        this.comanda.fechafintoma = moment().toDate();
                        this._comandaService.crearComanda(this.comanda, this.token).subscribe(
                            response => {
                                if (!response.entidad) {
                                    this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                                } else {
                                    this.comanda = null;
                                    this._router.navigate(['/comandas']);
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
            },
            reason => { }
        );
    }

    addFormaPago(fpago) {
        const idfpago = fpago._id;
        this.detcobcom = new DetalleCobroComanda(idfpago, null, false, [], false, false, false);
        this.detcobcom.descripcion = fpago.descripcion;
        this.detcobcom.estarjeta = fpago.estarjeta;
        this.detcobcom.escortesia = fpago.escortesia;
        this.detcobcom.condocumento = fpago.condocumento;
        this.detcobcom.detcobro.push(
            new DetalleCobro(
                this.saldocomanda, this.porcpend, null, null, null, fpago.estarjeta, null, null, null, null, null,
                fpago.condocumento, null, fpago.escortesia, null, false
            )
        );
        this.detallescobcom.push(this.detcobcom);

        if (!fpago.estarjeta && !fpago.condocumento && !fpago.escortesia) {
            this.loadVueltos(this.saldocomanda);
        }

        this.recalculaSaldoComanda();
    }

    addDetTarjeta(i, j) {
        this.detallescobcom[i].detcobro.push(
            new DetalleCobro(
                this.saldocomanda, this.porcpend, null, null, null, true, null, null, null, null, null, false, null, false, null, false
            )
        );
        this.recalculaSaldoComanda();
    }

    delDetTarjeta(i, j) {
        this.detallescobcom[i].detcobro.splice(j, 1);
        if (!this.detallescobcom[i].estarjeta) {
            this.detallescobcom.splice(i, 1);
        } else {
            if (this.detallescobcom[i].detcobro && this.detallescobcom[i].detcobro.length === 0) {
                this.detallescobcom.splice(i, 1);
            }
        }
        this.recalculaSaldoComanda();
    }

    checkLength(detalletc) {
        const numtc: string = detalletc.numero.toString().trim();
        if (numtc) {
            if (numtc.length > 16) {
                detalletc.numero = +numtc.substring(0, 16);
            }
        }
    }

    recalculaSaldoComanda() {
        let tmpTot = 0.00, tmpPor = 0.00;
        this.detallescobcom.forEach(detcc => {
            detcc.detcobro.forEach(item => {
                tmpTot += item.monto;
                tmpPor += item.porcentaje;
            });
        });
        this.saldocomanda = this.comanda.totalcomanda - tmpTot;
        this.porcpend = 100.00 - tmpPor;
    }

    recalcPorcentaje(txtMonto, txtPorcentaje, i, j) {
        this.detallescobcom[i].detcobro[j].porcentaje = parseFloat((txtMonto.value * 100 / this.comanda.totalcomanda).toFixed(2));
        this.recalculaSaldoComanda();
        this.loadVueltos(parseFloat(txtMonto.value));
    }

    recalcMonto(txtMonto, txtPorcentaje, i, j) {
        this.detallescobcom[i].detcobro[j].monto = parseFloat((txtPorcentaje.value * this.comanda.totalcomanda / 100).toFixed(2));
        this.recalculaSaldoComanda();
        this.loadVueltos(this.detallescobcom[i].detcobro[j].monto);
    }

    recalcSaldoFactA() {
        let tmpTot = 0.00;
        this.comanda.detfacturara.forEach(item => {
            tmpTot += item.monto;
        });
        this.saldofacta = this.comanda.totalcomanda - tmpTot;
    }

    addFacturarA(dfact) {
        if (this.comanda.detfacturara && this.comanda.detfacturara.length > 0 ) {
            // console.log(this.comanda.detfacturara);
            this.comanda.detfacturara.splice(0);
        }
        this.comanda.detfacturara.push(
            // new DetalleFacturarA(dfact.nombre, dfact.nit, dfact.direccion, this.saldofacta)
            new DetalleFacturarA(dfact.nombre, dfact.nit, dfact.direccion, this.comanda.totalcomanda)
        );
        this.recalcSaldoFactA();
    }

    delDetFactA(i) {
        this.comanda.detfacturara.splice(i, 1);
        this.recalcSaldoFactA();
    }

    calcVuelto(i, j) {
        if (this.detallescobcom[i].detcobro[j].vueltopara > 0) {
            this.detallescobcom[i].detcobro[j].vuelto =
                this.detallescobcom[i].detcobro[j].vueltopara - this.detallescobcom[i].detcobro[j].monto;
        } else {
            this.detallescobcom[i].detcobro[j].vuelto = 0.00;
        }
    }

    private printComanda(trackingNo: number, idcomanda: string) {
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

    guardarComanda() {
        if (this.comandaOriginal && this.comandaOriginal._id && this.comandaOriginal._id.trim() !== '') {
            this.comanda._id = this.comandaOriginal._id;
            this.comanda.fecha = this.comandaOriginal.fecha;
            this.comanda.fechainitoma = this.comandaOriginal.fecha;
            this.comanda.fechafintoma = this.comandaOriginal.fecha;
            this.comanda.tracking = this.comandaOriginal.tracking;
        }
        this.comanda.detallecomanda = this.detalleComanda;
        this.comanda.idestatuscomanda = '59fea7524218672b285ab0e3';
        this.comanda.iddatosfacturacliente =
        this.comandaOriginal.iddatosfacturacliente ? this.comandaOriginal.iddatosfacturacliente._id : null;
        this.comanda.totalcomanda = 0.00;
        // console.log(this.comanda);
        this.comanda.fechafintoma = moment().toDate();

        if (this.comandaOriginal && this.comandaOriginal._id && this.comandaOriginal._id.trim() !== '') {
            this._comandaService.modificarComanda(this.comanda, this.token).subscribe(
                response => {
                    if (!response.entidad) {
                        this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                    } else {
                        const trackingNo = response.entidad.tracking;
                        const idcomanda = response.entidad._id;
                        this.comanda = new Comanda(
                            null, null, null, null, null, null, null, null, null, null,
                            null, null, 0, 0, [], [], [], null, null, null, null, [], null, null, false
                        );
                        this.printComanda(trackingNo, idcomanda);
                    }
                },
                error => {
                    const respuesta = JSON.parse(error._body);
                    this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                }
            );
        } else {
            this._comandaService.crearComanda(this.comanda, this.token).subscribe(
                response => {
                    if (!response.entidad) {
                        this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                    } else {
                        const trackingNo = response.entidad.tracking;
                        const idcomanda = response.entidad._id;
                        this.comanda = new Comanda(
                            null, null, null, null, null, null, null, null, null, null,
                            null, null, 0, 0, [], [], [], null, null, null, null, [], null, null, false
                        );
                        this.printComanda(trackingNo, idcomanda);
                    }
                },
                error => {
                    const respuesta = JSON.parse(error._body);
                    this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                }
            );
        }
    }

    //#region Historico
    guardarHistorica() {
        this.comanda.idestatuscomanda = '59fea7f34218672b285ab0e8';
        this.comanda.detallecomanda = this.detalleComanda;
        this._comandaService.crearComanda(this.comanda, this.token).subscribe(
            response => {
                if (!response.entidad) {
                    this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                } else {
                    const idcliente = this.comanda.idcliente;
                    this.comanda = null;
                    this._router.navigate(['/clientes', idcliente]);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }
    //#endregion



}
