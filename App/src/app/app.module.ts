import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { BadgesComponent } from './components/badges/badges.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { CardsComponent } from './components/cards/cards.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ListGroupComponent } from './components/list-group/list-group.component';
import { ModalComponent } from './components/modal/modal.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ProgressComponent } from './components/progress/progress.component';
import { SpinnersComponent } from './components/spinners/spinners.component';
import { TooltipsComponent } from './components/tooltips/tooltips.component';
import { FormsElementsComponent } from './components/forms-elements/forms-elements.component';
import { FormsLayoutsComponent } from './components/forms-layouts/forms-layouts.component';
import { FormsEditorsComponent } from './components/forms-editors/forms-editors.component';
import { TablesGeneralComponent } from './components/tables-general/tables-general.component';
import { TablesDataComponent } from './components/tables-data/tables-data.component';
import { ChartsChartjsComponent } from './components/charts-chartjs/charts-chartjs.component';
import { ChartsApexchartsComponent } from './components/charts-apexcharts/charts-apexcharts.component';
import { IconsBootstrapComponent } from './components/icons-bootstrap/icons-bootstrap.component';
import { IconsRemixComponent } from './components/icons-remix/icons-remix.component';
import { IconsBoxiconsComponent } from './components/icons-boxicons/icons-boxicons.component';
import { PagesFaqComponent } from './pages/pages-faq/pages-faq.component';
import { PagesContactComponent } from './pages/pages-contact/pages-contact.component';
import { PagesError404Component } from './pages/pages-error404/pages-error404.component';
import { PagesBlankComponent } from './pages/pages-blank/pages-blank.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatTable, MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatDividerModule } from '@angular/material/divider'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

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
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatGridListModule } from '@angular/material/grid-list';

import { MatButtonModule } from '@angular/material/button';

import { NgSelectModule } from '@ng-select/ng-select';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SafePipe } from './pipes/safe.pipe';
@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        DashboardComponent,
        AlertsComponent,
        AccordionComponent,
        BadgesComponent,
        BreadcrumbsComponent,
        ButtonsComponent,
        CardsComponent,
        CarouselComponent,
        ListGroupComponent,
        ModalComponent,
        TabsComponent,
        PaginationComponent,
        ProgressComponent,
        SpinnersComponent,
        TooltipsComponent,
        FormsElementsComponent,
        FormsLayoutsComponent,
        FormsEditorsComponent,
        TablesGeneralComponent,
        TablesDataComponent,
        ChartsChartjsComponent,
        ChartsApexchartsComponent,
        IconsBootstrapComponent,
        IconsRemixComponent,
        IconsBoxiconsComponent,

        PagesFaqComponent,
        PagesContactComponent,
        PagesError404Component,
        PagesBlankComponent,

        CustomersComponent,
        PilotsComponent,
        TransportGroupsComponent,
        FlightPackagesComponent,
        ExtraServicesComponent,
        ReservationsComponent,
        ReservationFormComponent,
        PaymentsComponent,
        FlightTimesComponent,
        ExchangeRatesComponent,
        LoginComponent,
        ProfileComponent,
        UserManagementComponent,
        SafePipe
    ],
    bootstrap: [AppComponent] // This is correct
    , imports: [BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatTableModule,
        MatPaginatorModule,
        RouterModule,
        CommonModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatButtonModule,
        MatTabsModule,
        FormsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatDialogModule,
        NgSelectModule,
        DragDropModule
    ], providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ]
})
export class AppModule { }
// Updated to include PurchaseDetailsDialogComponent