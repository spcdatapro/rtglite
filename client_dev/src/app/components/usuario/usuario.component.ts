import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Modelos
import { Usuario } from '../../models/usuario';
import { RolUsuario } from '../../models/rolusuario';
import { Restaurante } from '../../models/restaurante';

// Servicios
import { GLOBAL } from '../../services/global';
import { LocalStorageService } from '../../services/localstorage.service';
import { UsuarioService } from '../../services/usuario.service';
import { RolUsuarioService } from '../../services/rolusuario.service';
import { RestauranteService } from '../../services/restaurante.service';

import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster';
// import * as moment from 'moment';

@Component({
    selector: 'app-mnt-usuario',
    templateUrl: './usuario.component.html',
    providers: [UsuarioService, RolUsuarioService, RestauranteService]
})
export class UsuarioComponent implements OnInit {
    public usuarios: Array<Usuario>;
    public usuario: Usuario;
    public roles: Array<RolUsuario>;
    public restaurantes: Array<Restaurante>;
    public contraseniaTemporal: string;

    private token: string;
    private toasterService: ToasterService;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _ls: LocalStorageService,
        private _usuarioService: UsuarioService,
        private _rolUsuarioService: RolUsuarioService,
        private _restauranteService: RestauranteService,
        toasterService: ToasterService
    ) {
        this.toasterService = toasterService;
        this.token = this._ls.get('restouchusr').token;
        this.usuario = new Usuario(null, null, null, null, null, [], [], false);
        this.contraseniaTemporal = null;
        this.restaurantes = [];
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({ positionClass: 'toast-bottom-full-width' });

    ngOnInit() {
        this.loadUsuarios();
        this.loadRoles();
        this.loadRestaurantes();
    }

    private loadUsuarios() {
        this._usuarioService.listaUsuarios(this.token).subscribe(
            response => {
                if (response.lista) {
                    this.usuarios = response.lista;
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

    private loadRoles() {
        this._rolUsuarioService.listaRolesUsuario(this.token, '0').subscribe(
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

    private loadRestaurantes() {
        this._restauranteService.listaRestaurantes(this.token, '0').subscribe(
            response => {
                if (response.lista) {
                    this.restaurantes = response.lista;
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

    getUsuario(idusuario, t) {
        this._usuarioService.getUsuario(idusuario, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.usuario = response.entidad;
                    this.loadRoles();
                    t.select('tabUsuario');
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

    onSubmitUsuario() {
        if (this.contraseniaTemporal && this.contraseniaTemporal.trim() !== '') { this.usuario.contrasenia = this.contraseniaTemporal; }
        this._usuarioService.crear(this.usuario, this.token).subscribe(
            response => {
                if (response.entidad) {
                    this.usuario = response.entidad;
                    this.loadUsuarios();
                    this.loadRoles();
                    this.loadRestaurantes();
                    this.toasterService.pop('success', 'Creación', response.mensaje);
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

    updUsuario() {
        if (this.contraseniaTemporal && this.contraseniaTemporal.trim() !== '') { this.usuario.contrasenia = this.contraseniaTemporal; }
        this._usuarioService.modificar(this.usuario, this.token).subscribe(
            response => {
                if (response.usr) {
                    this.usuario = response.usr;
                    this.loadUsuarios();
                    this.loadRoles();
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

    delUsuario() {
        this._usuarioService.eliminar(this.usuario._id, this.token).subscribe(
            response => {
                if (response.usr) {
                    this.usuario = new Usuario(null, null, null, null, null, [], [], false);
                    this.loadUsuarios();
                    this.loadRoles();
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

    nuevoUsuario() {
        this.usuario = new Usuario(null, null, null, null, null, [], [], false);
    }

    addRolUsr(obj) {
        // console.log(obj.value + ' - ' + obj.options[obj.selectedIndex].innerText);
        if (!this.usuario.roles) { this.usuario.roles = []; }
        this.usuario.roles.push(
            new RolUsuario(obj.value, obj.options[obj.selectedIndex].innerText, false)
        );
    }

    addRestauranteUsr(obj) {
        if (!this.usuario.restaurante) { this.usuario.restaurante = []; }
        this.usuario.restaurante.push(
            new Restaurante(obj.value, obj.options[obj.selectedIndex].innerText, false)
        );
    }
}
