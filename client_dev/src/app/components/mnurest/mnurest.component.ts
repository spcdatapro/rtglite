import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { MenuRestaurante } from '../../models/menurest';
import { MenuRestComponente } from '../../models/menurestcomponente';
import { Componente } from '../../models/componente';
import { DetalleComanda } from '../../models/detallecomanda';

// Servicios
import { GLOBAL } from '../../services/global';
import { LocalStorageService } from '../../services/localstorage.service';
import { MenuRestauranteService } from '../../services/menurest.service';
import { MenuRestComponenteService } from '../../services/menurestcomponente.service';
import { ComponenteService } from '../../services/componente.service';

// Otros
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { TREE_ACTIONS, IActionMapping } from 'angular-tree-component';

@Component({
    selector: 'app-menu-rest',
    templateUrl: './mnurest.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [MenuRestauranteService, LocalStorageService, MenuRestComponenteService, ComponenteService],
    styles: [`.modal-size .modal-content { width: 950px }`]
})
export class MenuRestauranteComponent implements OnInit {
    private toasterService: ToasterService;
    private token: string;
    public options: object;
    public mnures: MenuRestaurante;
    public listaCompletaMenu: MenuRestaurante[];
    public arbolMenu: any[];
    public lstMenuRestComponente: Array<MenuRestComponente>;
    public menuRestComponente: MenuRestComponente;
    public lstComponentes: Array<Componente>;
    public carta: Array<any>;
    public detcom: DetalleComanda;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _menuRestauranteService: MenuRestauranteService,
        private _ls: LocalStorageService,
        private _menuRestComponenteService: MenuRestComponenteService,
        private _componenteService: ComponenteService,
        private modalService: NgbModal,
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;
        this.token = this._ls.get('restouchusr').token;
        this.mnures = new MenuRestaurante(null, null, null, 0, null, false, null, null, null, false, [], false);
        this.menuRestComponente = new MenuRestComponente(null, null, null, false);
        this.lstMenuRestComponente = [];
        this.listaCompletaMenu = [];
        this.lstComponentes = [];
        this.listaCompletaMenu.push({
            _id: null, descripcion: 'N/A', idpadre: null, nivel: null, precio: null, tienecomponentes: null,
            precioextra: null, tieneextras: null, limitecomponentes: null, espromocion: false, itemspromo: [], debaja: null
        });
        this.options = {
            useVirtualScroll: true,
            nodeHeight: 50
        };
        this.carta = new Array();
        this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false);
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({ positionClass: 'toast-bottom-full-width' });

    private loadAllMenu() {
        this._menuRestauranteService.listamenu(this.token).subscribe(
            response => {
                response.lista.forEach(element => {
                    if (!element.tienecomponentes) {
                        this.listaCompletaMenu.push(element);
                    }
                });
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadArbolMenu() {
        this._menuRestauranteService.menurestaurante(this.token).subscribe(
            response => {
                this.arbolMenu = response.lista;
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    private loadComponentes() {
        this._componenteService.listaComponentes(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.lstComponentes = response.lista;
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

    ngOnInit() {
        this.loadAllMenu();
        this.loadArbolMenu();
        this.loadComponentes();
    }

    setMenuData(idobj) {
        this.listaCompletaMenu.forEach(item => {
            if (item._id === idobj) {
                this.mnures.nivel = item.nivel + 1;
            }
        });
    }

    onSubmit() {
        this._menuRestauranteService.crear(this.mnures, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.mnures = new MenuRestaurante(null, null, null, 0, null, false, null, null, null, null, [], false);
                    this.loadAllMenu();
                    this.loadArbolMenu();
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

    getItemMenu(idmenu) {
        // console.log(idmenu);
        this._menuRestauranteService.getMenu(idmenu, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.mnures = response.entidad;
                    this.loadDetalleMenu();
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

    updMenuRest() {
        this._menuRestauranteService.modificar(this.mnures, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.mnures = response.entidad;
                    this.loadAllMenu();
                    this.loadArbolMenu();
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

    //#region Detalle de componentes

    private loadDetalleMenu() {
        this._menuRestComponenteService.listaMenuRestComponente(this.token, this.mnures._id).subscribe(
            response => {
                if (response.lista) {
                    this.lstMenuRestComponente = response.lista;
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

    onSubmitDetalle() {
        this.menuRestComponente.idmenurest = this.mnures._id;
        this._menuRestComponenteService.crear(this.menuRestComponente, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.menuRestComponente = new MenuRestComponente(null, this.mnures._id, null, false);
                    this.loadDetalleMenu();
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

    delDetalleMenu(idmenurest) {
        this._menuRestComponenteService.eliminar(idmenurest, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.menuRestComponente = new MenuRestComponente(null, this.mnures._id, null, false);
                    this.loadDetalleMenu();
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

    //#region Promociones
    private cleanVars() {
        this.detcom = new DetalleComanda(null, 1, null, null, '', [], [], null, null, null, false);
        this.carta.splice(1);
    }

    agregaADetalleComanda(itemMenu: MenuRestaurante, detalleTemp: DetalleComanda) {
        // console.log(itemMenu);
        this.mnures.itemspromo.push(
            new DetalleComanda(
                itemMenu._id, 1, 0, null, detalleTemp.descripcion, [], [],
                itemMenu.limitecomponentes, itemMenu.tieneextras, itemMenu.precioextra, false
            )
        );
        this.cleanVars();
        // console.log(this.mnures.itemspromo);
    }

    setDetTemp(nivel: number, itemMenu: MenuRestaurante) {
        if (nivel > 0) {
            if (this.detcom.descripcion !== '') { this.detcom.descripcion += '-'; }
            this.detcom.descripcion += itemMenu.descripcion;
        } else if (itemMenu) {
            this.detcom.descripcion = itemMenu.descripcion;
        }

        if (itemMenu && itemMenu.precio) { this.detcom.precio = itemMenu.precio; }
    }

    loadCarta(nivel, idpadre = null, itemMenu: MenuRestaurante = null) {
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
                    this.setDetTemp(nivel, itemMenu);
                    this.agregaADetalleComanda(itemMenu, this.detcom);
                }
            },
            error => {
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }

    armarPromocion(modalPromo) {
        this.loadCarta(0);
        this.modalService.open(modalPromo, {windowClass : 'modal-size'}).result.then(
            result => {
                this.updMenuRest();
            },
            reason => { }
        );
    }

    removeItemPromo(i) { 
        this.mnures.itemspromo.splice(i, 1); 
    }

    //#endregion

}
