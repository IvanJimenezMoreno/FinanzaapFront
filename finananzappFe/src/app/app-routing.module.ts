import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { PrincipalComponent } from './principal/principal.component';
import { PresupuestosComponent } from './presupuestos/presupuestos.component';
import { PagosComponent } from './pagos/pagos.component';
import { GraficosComponent } from './graficos/graficos.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'login', component: LoginComponent},
  {path: 'principal', component: PrincipalComponent},
  { path: 'presupuestos', component: PresupuestosComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'graficos', component: GraficosComponent },
  { path: 'movimientos', component: MovimientosComponent },
  {path: 'admin', component: AdminComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
