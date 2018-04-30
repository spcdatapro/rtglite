import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { GLOBAL } from '../../services/global';
import { UsuarioService } from '../../services/usuario.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { MintService } from '../../services/mint.service';
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';

@Component({
    selector: 'app-log-in',
    templateUrl: './login.component.html',
    providers: [UsuarioService, LocalStorageService, MintService]
})
export class LoginComponent implements OnInit {
    public usuario: Usuario;
    private toasterService: ToasterService;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _usuarioService: UsuarioService,
        private _ls: LocalStorageService,
        private _mintService: MintService,
        toasterService: ToasterService
    ) {
        this.usuario = new Usuario(null, null, null, null, null, [], [], false);
        this.toasterService = toasterService;
    }

    public toasterconfig: ToasterConfig = new ToasterConfig({positionClass: 'toast-bottom-full-width'});

    ngOnInit() {
        // console.log('login.component cargado...');
    }

    onSubmit() {
        this._usuarioService.signup(this.usuario).subscribe(
            response => {
                if (response.token) {
                    response.entidad.token = response.token;
                    this._ls.set('restouchusr', response.entidad);
                    this.toasterService.pop('success', 'Login', response.mensaje);
                    this._mintService.getMintToken().subscribe(
                        respMint => {
                            this._ls.set('m1nt', respMint.entidad);
                        },
                        errMint => {
                            const respuesta = JSON.parse(errMint._body);
                            this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
                        },
                        () => {
                            this._router.navigate(['/comandas']);
                        });
                }else {
                    this._ls.clearAll();
                    this.toasterService.pop('warning', 'Denegado', response.mensaje);
                }
            },
            error => {
                this._ls.clearAll();
                const respuesta = JSON.parse(error._body);
                this.toasterService.pop('error', 'Error', 'Error: ' + respuesta.mensaje);
            }
        );
    }
}
