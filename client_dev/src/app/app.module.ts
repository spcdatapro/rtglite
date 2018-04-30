import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from 'angular-tree-component';
import { MomentModule } from 'angular2-moment';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ListadoClientesComponent } from './components/cliente/lstclientes.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ListaComandasComponent } from './components/comanda/lstcomandas.component';
import { ComandaComponent } from './components/comanda/comanda.component';
import { MenuRestauranteComponent } from './components/mnurest/mnurest.component';
import { MantenimientosVariosComponent } from './components/mntvarios/mntvarios.component';
import { DiccionarioFoxComponent } from './components/diccionariofox/diccionariofox.component';
import { ClockComponent } from './components/clock/clock.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { VisorPDFComponent } from './components/reportes/visorpdf.component';
import { VentasVariosComponent } from './components/reportes/ventas/ventasvarios.component';

// Servicios
import { GoogleApiService } from './services/gapi.service';
// import { MintService } from './services/mint.service';
import { ComandaService } from './services/comanda.service';
import { DiccionarioFoxService } from './services/diccionariofox.service';
import { ClienteService } from './services/cliente.service';

// Pipes
import { FilterListPipe } from './pipes/filterlist.pipe';

@NgModule({
  declarations: [
    AppComponent, LoginComponent, ListadoClientesComponent, ClienteComponent, FilterListPipe, ListaComandasComponent,
    MenuRestauranteComponent, MantenimientosVariosComponent, ComandaComponent, DiccionarioFoxComponent, ClockComponent, UsuarioComponent,
    VisorPDFComponent, VentasVariosComponent
  ],
  imports: [
    NgbModule.forRoot(), BrowserModule, FormsModule, HttpModule, routing, BrowserAnimationsModule, ToasterModule, TreeModule,
    MomentModule, HttpClientModule
  ],
  providers: [
    appRoutingProviders, GoogleApiService, DiccionarioFoxService, ComandaService, ClienteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
