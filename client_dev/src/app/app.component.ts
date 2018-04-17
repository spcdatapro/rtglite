import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from './services/localstorage.service';
import { MenuService } from './services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ LocalStorageService, MenuService ]
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
  ) {
    this.usuarioActual = this._ls.get('restouchusr');
    this.options = {
      useVirtualScroll: true,
      nodeHeight: 50
    };
    this.arbolMenuApp = null;
    this.menuVisible = false;
  }

  ngOnInit() { }

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
        }
      );
    }
  }

  goToUrl(obj) {
    this._router.navigate(['/' + obj.url]);
  }

  logOut() {
    this._ls.clear('restouchusr');
    this.goToUrl({url: ''});
  }

  toggleMenu() { this.menuVisible = !this.menuVisible; }

}
