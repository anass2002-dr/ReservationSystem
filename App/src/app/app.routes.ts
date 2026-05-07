import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './pages/customers/customers.component';
import { CountriesComponent } from './pages/countries/countries.component';
import { PilotsComponent } from './pages/pilots/pilots.component';
import { TransportGroupsComponent } from './pages/transport-groups/transport-groups.component';
import { FlightPackagesComponent } from './pages/flight-packages/flight-packages.component';
import { ExtraServicesComponent } from './pages/extra-services/extra-services.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { PaymentsComponent } from './pages/payments/payments.component';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Customers', component: CustomersComponent },
  { path: 'Countries', component: CountriesComponent },
  { path: 'Pilots', component: PilotsComponent },
  { path: 'TransportGroups', component: TransportGroupsComponent },
  { path: 'FlightPackages', component: FlightPackagesComponent },
  { path: 'ExtraServices', component: ExtraServicesComponent },
  { path: 'Reservations', component: ReservationsComponent },
  { path: 'Payments', component: PaymentsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }