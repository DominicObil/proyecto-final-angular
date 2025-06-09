import { Routes } from '@angular/router';
import { RestaurantsComponent } from './features/restaurants/restaurants.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { MisReservasComponent } from './features/reservas/mis-reservas/mis-reservas.component';
import { RestaurantsListComponent } from './features/restaurants/restaurants-list/restaurants-list.component';
import { SolicitudesRestaurantePanelComponent } from './features/restaurants/solicitudes-restaurante-panel/solicitudes-restaurante-panel.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'restaurants', component: RestaurantsComponent },


  {
    path: 'reservar/:restauranteId',
    loadComponent: () =>
      import('./features/reservas/reserva-form/reserva-form.component').then(m => m.ReservaFormComponent)
  },
  {
    path: 'reservas-restaurante/:restauranteId',
    loadComponent: () =>
      import('./features/reservas/reservas-por-restaurante/reservas-por-restaurante.component').then(m => m.ReservasPorRestauranteComponent)
  },
  {
    path: 'editar-reserva/:id',
    loadComponent: () =>
      import('./features/reservas/editar-reserva/editar-reserva.component').then(m => m.EditarReservaComponent),
    canActivate: [authGuard]
  },

  // Rutas normales
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'mis-reservas',
    component: MisReservasComponent,
    canActivate: [authGuard]
  },
  {
    path: 'mis-restaurantes',
    component: RestaurantsListComponent
  },
  {
    path: 'panel-solicitudes',
    component: SolicitudesRestaurantePanelComponent,
    canActivate: [authGuard]
  },
  {
    path: 'solicitar-restaurante',
    loadComponent: () =>
      import('./features/restaurants/solicitud-restaurante-form/solicitud-restaurante-form.component')
        .then(m => m.SolicitudRestauranteFormComponent)
  },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', component: Error404Component }
];
