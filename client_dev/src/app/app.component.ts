import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from './services/localstorage.service';
import { MenuService } from './services/menu.service';
import { GoogleApiService } from './services/gapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [LocalStorageService, MenuService, GoogleApiService]
})
export class AppComponent implements OnInit, DoCheck {
  title = 'ResTouch';
  public usuarioActual: any;
  public arbolMenuApp: any[];
  public menuVisible: boolean;
  private options: object;

  constructor(
    private _mnu: MenuService,
    private _ls: LocalStorageService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _gApiService: GoogleApiService
  ) {
    this.usuarioActual = this._ls.get('restouchusr');
    this.options = {
      useVirtualScroll: true,
      nodeHeight: 50
    };
    this.arbolMenuApp = null;
    this.menuVisible = false;
  }

  ngOnInit() {

    this._route.queryParams.subscribe(params => {
      let gcode: string = params['code'];
      // console.log(gcode);
      if (!gcode || gcode.trim().length === 0) {
        gcode = this._ls.get('gcode', false);
        if (!gcode || gcode.trim().length === 0) {
          this._gApiService.getURLAuth().subscribe(
            response => {
              // console.log('Response:', response.result.googleURLToken);
              if (response.result.googleURLToken) {
                window.location.href = response.result.googleURLToken;
              } else {
                console.log('No se pudo obtener la dirección para autenticación...');
              }
            },
            error => {
              const respuesta = JSON.parse(error._body);
              console.log('Error: ' + respuesta.mensaje);
            }
          );
        } else {
          this.doGetToken(gcode);
        }
      } else {
        this._ls.set('gcode', gcode, false);
        this.doGetToken(gcode);
      }
    });
  }

  ngDoCheck() {
    this.usuarioActual = this._ls.get('restouchusr');
    // console.log(this.usuarioActual);
    if (this.usuarioActual && !this.arbolMenuApp) {
      this._mnu.getMenuUsuario(this.usuarioActual._id, this.usuarioActual.token).subscribe(
        response => {
          this.arbolMenuApp = response.lista;
          // console.log(this.arbolMenuApp);
          // this._router.navigate(['/comandas']);
        },
        error => {
          // console.log('Hubo error...');
          this._ls.clear('restouchusr');
          this._ls.clear('gcode');
        }
      );
    }
  }

  doGetToken(gcode) {
    this._gApiService.getToken(gcode, '').subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          this._gApiService.updGoogleToken().subscribe(resUpdT => {}, errUpdT => {});
        }
      },
      error => {
        const respuesta = JSON.parse(error._body);
        console.log('Error: ' + respuesta.mensaje);
      }
    );
  }

  goToUrl(obj) {
    this._router.navigate(['/' + obj.url]);
  }

  logOut() {
    this._ls.clear('restouchusr');
    this._ls.clear('gcode');
    this._ls.clear('m1nt');
    this.goToUrl({url: ''});
  }

  toggleMenu() { this.menuVisible = !this.menuVisible; }

}
