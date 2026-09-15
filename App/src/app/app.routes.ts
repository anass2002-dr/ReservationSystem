import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './pages/customers/customers.component';
import { PilotsComponent } from './pages/pilots/pilots.component';
import { TransportGroupsComponent } from './pages/transport-groups/transport-groups.component';
import { FlightPackagesComponent } from './pages/flight-packages/flight-packages.component';
import { ExtraServicesComponent } from './pages/extra-services/extra-services.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { ReservationFormComponent } from './pages/reservation-form/reservation-form.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { FlightTimesComponent } from './pages/flight-times/flight-times.component';
import { ExchangeRatesComponent } from './pages/exchange-rates/exchange-rates.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AgenciesComponent } from './pages/agencies/agencies.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'admin/users', component: UserManagementComponent, data: { roles: ['Admin'] } },
      { path: 'Customers', component: CustomersComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'pilots', component: PilotsComponent },
      { path: 'agencies', component: AgenciesComponent },
      { path: 'transport-groups', component: TransportGroupsComponent },
      { path: 'flight-packages', component: FlightPackagesComponent },
      { path: 'extra-services', component: ExtraServicesComponent },
      { path: 'flight-times', component: FlightTimesComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reservations/add', component: ReservationFormComponent },
      { path: 'reservations/edit/:id', component: ReservationFormComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'exchange-rates', component: ExchangeRatesComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }