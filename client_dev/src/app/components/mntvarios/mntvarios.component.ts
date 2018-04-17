import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { TipoDireccion } from '../../models/tipodireccion';
import { Restaurante } from '../../models/restaurante';
import { Componente } from '../../models/componente';
import { FormaPago } from '../../models/formapago';
import { EmisorTarjeta } from '../../models/emisortarjeta';
import { Banner } from '../../models/banner';
import { Vuelto } from '../../models/vuelto';
import { RazonCortesia } from '../../models/razoncortesia';
import { TiempoEntrega } from '../../models/tiempoentrega';
import { RolUsuario } from '../../models/rolusuario';
import { PresupuestoVentas } from '../../models/presupuestoventas';

// Servicios
import { GLOBAL } from '../../services/global';
import { TipoDireccionService } from '../../services/tipodireccion.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { RestauranteService } from '../../services/restaurante.service';
import { ComponenteService } from '../../services/componente.service';
import { FormaPagoService } from '../../services/formapago.service';
import { EmisorTarjetaService } from '../../services/emisortarjeta.service';
import { BannerService } from '../../services/banner.service';
import { VueltoService } from '../../services/vuelto.service';
import { RazonCortesiaService } from '../../services/razoncortesia.service';
import { TiempoEntregaService } from '../../services/tiempoentrega.service';
import { RolUsuarioService } from '../../services/rolusuario.service';
import { PresupuestoVentasService } from '../../services/presupuestoventas.service';

// Otros
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import * as moment from 'moment';

@Component({
    selector: 'app-mnt-varios',
    templateUrl: './mntvarios.component.html',
    providers: [
        LocalStorageService, TipoDireccionService, RestauranteService, ComponenteService, FormaPagoService, EmisorTarjetaService,
        BannerService, VueltoService, RazonCortesiaService, TiempoEntregaService, RolUsuarioService, PresupuestoVentasService
    ]
})
export class MantenimientosVariosComponent implements OnInit {
    private toasterService: ToasterService;
    private token: String;
    public tiposDireccion: TipoDireccion[];
    public tipoDireccion: TipoDireccion;
    public restaurantes: Restaurante[];
    public restaurante: Restaurante;
    public bans: Array<Banner>;
    public ban: Banner;
    public vlts: Array<Vuelto>;
    public vlt: Vuelto;
    public rcorts: Array<RazonCortesia>;
    public rcort: RazonCortesia;
    public tiempos: Array<TiempoEntrega>;
    public tiempo: TiempoEntrega;
    public roles: Array<RolUsuario>;
    public rol: RolUsuario;
    public presventas: Array<PresupuestoVentas>;
    public presventa: PresupuestoVentas;
    private compos: Array<Componente>;
    private compo: Componente;
    private formasPago: Array<FormaPago>;
    private formaPago: FormaPago;
    private emisor: EmisorTarjeta;
    private emisores: Array<EmisorTarjeta>;
    private usuario;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _ls: LocalStorageService,
        private _tipoDireccionService: TipoDireccionService,
        private _restauranteService: RestauranteService,
        private _componenteService: ComponenteService,
        private _formaPagoService: FormaPagoService,
        private _emisorTarjetaService: EmisorTarjetaService,
        private _bannerService: BannerService,
        private _vueltoService: VueltoService,
        private _razonCortesiaService: RazonCortesiaService,
        private _tiempoEntregaService: TiempoEntregaService,
        private _rolUsuarioService: RolUsuarioService,
        private _presupuestoVentasService: PresupuestoVentasService,
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;
        this.token = this._ls.get('restouchusr').token;
        this.usuario = this._ls.get('restouchusr');
        this.restaurante = new Restaurante(null, null, false);
        this.tipoDireccion = new TipoDireccion(null, null, false);
        this.compo = new Componente(null, null, false, false, false);
        this.formaPago = new FormaPago(null, null, false, false, false, null, false);
        this.emisor = new EmisorTarjeta(null, null, false);
        this.ban = new Banner(null, null, false, null, null, null, null, null, null, false);
        this.vlt = new Vuelto(null, null, null, false);
        this.rcort = new RazonCortesia(null, null, false);
        this.tiempo = new TiempoEntrega(null, null, false);
        this.rol = new RolUsuario(null, null, false);
        this.presventa = new PresupuestoVentas(null, null, null, null, false);
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({positionClass: 'toast-bottom-full-width'});

    ngOnInit() {
        this.loadRestaurantes();
        this.loadTiposDireccion();
        this.loadComponentes();
        this.loadFormasPago();
        this.loadEmisoresTarjeta();
        this.loadBanners();
        this.loadVueltos();
        this.loadRazonesCortesia();
        this.loadTiemposEntrega();
        this.loadRolesUsuario();
        this.loadPresupuestosVentas();
    }

    private loadRestaurantes() {
        this._restauranteService.listaRestaurantes(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.restaurantes = response.lista;
                }else {
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
        this._tipoDireccionService.listaTiposDeDireccion(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.tiposDireccion = response.lista;
                }else {
                    this.toasterService.pop('error', 'Error', 'Error: ' + response.mensaje);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadComponentes() {
        this._componenteService.listaComponentes(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.compos = response.lista;
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

    private loadFormasPago() {
        this._formaPagoService.listaFormasPago(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.formasPago = response.lista;
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

    private loadEmisoresTarjeta() {
        this._emisorTarjetaService.listaEmisoresTarjeta(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.emisores = response.lista;
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

    private loadBanners() {
        this._bannerService.listaBanners(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.bans = response.lista;
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

    private loadVueltos() {
        this._vueltoService.listaVueltos(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.vlts = response.lista;
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

    private loadRazonesCortesia() {
        this._razonCortesiaService.listaRazonesCortesia(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.rcorts = response.lista;
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

    private loadTiemposEntrega() {
        this._tiempoEntregaService.listaTiemposEntrega(this.token, '2').subscribe(
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

    private loadRolesUsuario() {
        this._rolUsuarioService.listaRolesUsuario(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.roles = response.lista;
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

    private loadPresupuestosVentas() {
        this._presupuestoVentasService.listaPresupuestoVentas(this.token, '2').subscribe(
            response => {
                if (response.lista) {
                    this.presventas = response.lista;
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

    //#region Restaurantes

    onSubmitRest() {
        this._restauranteService.crear(this.restaurante, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadRestaurantes();
                    this.restaurante = new Restaurante(null, null, false);
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

    getRestaurante(idrestaurante) {
        this._restauranteService.getRestaurante(idrestaurante, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.restaurante = response.entidad;
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

    updRestaurante() {
        this._restauranteService.modificar(this.restaurante, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.restaurante = response.entidad;
                    this.loadRestaurantes();
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

    delRestaurante() {
        this._restauranteService.eliminar(this.restaurante._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.restaurante = new Restaurante(null, null, false);
                    this.loadRestaurantes();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoRestaurante() {
        this.restaurante = new Restaurante(null, null, false);
    }
    //#endregion

    //#region Tipos de dirección

    onSubmitTipoDireccion() {
        this._tipoDireccionService.crear(this.tipoDireccion, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadTiposDireccion();
                    this.tipoDireccion = new TipoDireccion(null, null, false);
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

    getTipoDireccion(idtipodir) {
        this._tipoDireccionService.getTipoDireccion(idtipodir, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.tipoDireccion = response.entidad;
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

    updTipoDireccion() {
        this._tipoDireccionService.modificar(this.tipoDireccion, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.tipoDireccion = response.entidad;
                    this.loadTiposDireccion();
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

    delTipoDireccion() {
        this._tipoDireccionService.eliminar(this.tipoDireccion._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.tipoDireccion = new TipoDireccion(null, null, false);
                    this.loadTiposDireccion();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoTipoDireccion() {
        this.tipoDireccion = new TipoDireccion(null, null, false);
    }

    //#endregion

    //#region Componentes
    onSubmitComponente() {
        this._componenteService.crear(this.compo, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadComponentes();
                    this.compo = new Componente(null, null, false, false, false);
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

    getComponente(idcompo) {
        this._componenteService.getComponente(idcompo, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.compo = response.entidad;
                    window.scrollTo(0, 0);
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

    updComponente() {
        this._componenteService.modificar(this.compo, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.compo = response.entidad;
                    this.loadComponentes();
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

    delComponente() {
        this._componenteService.eliminar(this.compo._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.compo = new Componente(null, null, false, false, false);
                    this.loadComponentes();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoComponente() {
        this.compo = new Componente(null, null, false, false, false);
    }
    //#endregion

    //#region Formas de pago
    onSubmitFormaPago() {
        this._formaPagoService.crear(this.formaPago, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadFormasPago();
                    this.formaPago = new FormaPago(null, null, false, false, false, null, false);
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

    getFormaPago(idfpago) {
        this._formaPagoService.getFormaPago(idfpago, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.formaPago = response.entidad;
                    window.scrollTo(0, 0);
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

    updFormaPago() {
        this._formaPagoService.modificar(this.formaPago, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.formaPago = response.entidad;
                    this.loadFormasPago();
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

    delFormaPago() {
        this._formaPagoService.eliminar(this.formaPago._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.formaPago = new FormaPago(null, null, false, false, false, null, false);
                    this.loadFormasPago();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevaFormaPago() {
        this.formaPago = new FormaPago(null, null, false, false, false, null, false);
    }
    //#endregion

    //#region Emisores de tarjeta
    onSubmitEmisorTarjeta() {
        this._emisorTarjetaService.crear(this.emisor, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadEmisoresTarjeta();
                    this.emisor = new EmisorTarjeta(null, null, false);
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

    getEmisorTarjeta(identidad) {
        this._emisorTarjetaService.getEmisorTarjeta(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.emisor = response.entidad;
                    window.scrollTo(0, 0);
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

    updEmisorTarjeta() {
        this._emisorTarjetaService.modificar(this.emisor, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.emisor = response.entidad;
                    this.loadEmisoresTarjeta();
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

    delEmisorTarjeta() {
        this._emisorTarjetaService.eliminar(this.emisor._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.emisor = new EmisorTarjeta(null, null, false);
                    this.loadEmisoresTarjeta();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoEmisorTarjeta() {
        this.emisor = new EmisorTarjeta(null, null, false);
    }
    //#endregion

    //#region Banners
    onSubmitBanner() {
        this.ban.fechacrea = new Date();
        this.ban.idusrcrea = this.usuario._id;
        if (this.ban.espermanente) { this.ban.fechadel = null; this.ban.fechaal = null; }
        this._bannerService.crear(this.ban, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadBanners();
                    this.ban = new Banner(null, null, false, null, null, null, null, null, null, false);
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

    getBanner(identidad) {
        this._bannerService.getBanner(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.ban = response.entidad;
                    window.scrollTo(0, 0);
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

    updBanner() {
        this.ban.fechamod = new Date();
        this.ban.idusrmod = this.usuario._id;
        if (this.ban.espermanente) { this.ban.fechadel = null; this.ban.fechaal = null; }
        this._bannerService.modificar(this.ban, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.ban = response.entidad;
                    this.loadBanners();
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

    delBanner() {
        this.ban.fechamod = new Date();
        this.ban.idusrmod = this.usuario._id;
        if (this.ban.espermanente) { this.ban.fechadel = null; this.ban.fechaal = null; }
        this._bannerService.eliminar(this.ban._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.ban = new Banner(null, null, false, null, null, null, null, null, null, false);
                    this.loadBanners();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoBanner() {
        this.ban = new Banner(null, null, false, null, null, null, null, null, null, false);
    }
    //#endregion

    //#region Vueltos
    onSubmitVuelto() {
        this._vueltoService.crear(this.vlt, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadVueltos();
                    this.vlt = new Vuelto(null, null, null, false);
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

    getVuelto(identidad) {
        this._vueltoService.getVuelto(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.vlt = response.entidad;
                    window.scrollTo(0, 0);
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

    updVuelto() {
        this._vueltoService.modificar(this.vlt, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.vlt = response.entidad;
                    this.loadVueltos();
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

    delVuelto() {
        this._vueltoService.eliminar(this.vlt._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.vlt = new Vuelto(null, null, null, false);
                    this.loadVueltos();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoVuelto() {
        this.vlt = new Vuelto(null, null, null, false);
    }
    //#endregion

    //#region Razones de cortesia
    onSubmitRCort() {
        this._razonCortesiaService.crear(this.rcort, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadRazonesCortesia();
                    this.rcort = new RazonCortesia(null, null, false);
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

    getRCort(identidad) {
        this._razonCortesiaService.getRazonCortesia(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.rcort = response.entidad;
                    window.scrollTo(0, 0);
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

    updRCort() {
        this._razonCortesiaService.modificar(this.rcort, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.rcort = response.entidad;
                    this.loadRazonesCortesia();
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

    delRCort() {
        this._razonCortesiaService.eliminar(this.rcort._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.rcort = new RazonCortesia(null, null, false);
                    this.loadRazonesCortesia();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevaRCort() {
        this.rcort = new RazonCortesia(null, null, false);
    }
    //#endregion

    //#region Tiempo de entrega
    onSubmitTiempoEntrega() {
        this._tiempoEntregaService.crear(this.tiempo, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadTiemposEntrega();
                    this.tiempo = new TiempoEntrega(null, null, false);
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

    getTiempoEntrega(identidad) {
        this._tiempoEntregaService.getTiempoEntrega(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.tiempo = response.entidad;
                    window.scrollTo(0, 0);
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

    updTiempoEntrega() {
        this._tiempoEntregaService.modificar(this.tiempo, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.tiempo = response.entidad;
                    this.loadTiemposEntrega();
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

    delTiempoEntrega() {
        this._tiempoEntregaService.eliminar(this.tiempo._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.tiempo = new TiempoEntrega(null, null, false);
                    this.loadTiemposEntrega();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoTiempoEntrega() {
        this.tiempo = new TiempoEntrega(null, null, false);
    }
    //#endregion

    //#region Roles de usuario
    onSubmitRol() {
        this._rolUsuarioService.crear(this.rol, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadRolesUsuario();
                    this.rol = new RolUsuario(null, null, false);
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

    getRol(identidad) {
        this._rolUsuarioService.getRolUsuario(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.rol = response.entidad;
                    window.scrollTo(0, 0);
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

    updRol() {
        this._rolUsuarioService.modificar(this.rol, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.rol = response.entidad;
                    this.loadRolesUsuario();
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

    delRol() {
        this._rolUsuarioService.eliminar(this.rol._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.rol = new RolUsuario(null, null, false);
                    this.loadRolesUsuario();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoRol() {
        this.rol = new RolUsuario(null, null, false);
    }
    //#endregion

    //#region Presupuestos de venta
    onSubmitPresVenta() {
        this._presupuestoVentasService.crear(this.presventa, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.loadPresupuestosVentas();
                    this.presventa = new PresupuestoVentas(null, null, null, null, false);
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

    getPresVenta(identidad) {
        this._presupuestoVentasService.getPresupuestoVenta(identidad, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.presventa = response.entidad;
                    window.scrollTo(0, 0);
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

    updPresVenta() {
        this._presupuestoVentasService.modificar(this.presventa, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.presventa = response.entidad;
                    this.loadPresupuestosVentas();
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

    delPresVenta() {
        this._presupuestoVentasService.eliminar(this.presventa._id, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.presventa = new PresupuestoVentas(null, null, null, null, false);
                    this.loadPresupuestosVentas();
                    this.toasterService.pop('success', 'Dado de baja', response.mensaje);
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

    nuevoPresVenta() {
        this.presventa = new PresupuestoVentas(null, null, null, null, false);
    }
    //#endregion

}
