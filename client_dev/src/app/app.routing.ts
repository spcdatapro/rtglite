import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { ListadoClientesComponent } from './components/cliente/lstclientes.component';
import { ListaComandasComponent } from './components/comanda/lstcomandas.component';
import { ComandaComponent } from './components/comanda/comanda.component';
import { MenuRestauranteComponent } from './components/mnurest/mnurest.component';
import { MantenimientosVariosComponent } from './components/mntvarios/mntvarios.component';
import { DiccionarioFoxComponent } from './components/diccionariofox/diccionariofox.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { VentasVariosComponent } from './components/reportes/ventas/ventasvarios.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'comandas', component: ListaComandasComponent },
    { path: 'comanda/:idcliente', component: ComandaComponent },
    { path: 'comanda/:idcliente/:telefono', component: ComandaComponent },
    { path: 'comanda/:idcliente/:telefono/:historica', component: ComandaComponent },
    { path: 'comanda/:idcliente/:telefono/:historica/:idcomanda', component: ComandaComponent },
    { path: 'clientes', component: ListadoClientesComponent },
    { path: 'clientes/:idcliente', component: ListadoClientesComponent },
    { path: 'mnurest', component: MenuRestauranteComponent },
    { path: 'mantvar', component: MantenimientosVariosComponent },
    { path: 'dictfox', component: DiccionarioFoxComponent },
    { path: 'mntusr', component: UsuarioComponent },
    { path: 'ventvar', component: VentasVariosComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'login' }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
