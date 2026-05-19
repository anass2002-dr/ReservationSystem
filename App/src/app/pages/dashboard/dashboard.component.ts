import { Component, OnInit } from '@angular/core';
import { Reservation, Customer, Payment, FlightTime, PaymentCurrency } from '../../models/models';
import { ReservationService } from '../../services/reservation.service';
import { CustomerService } from '../../services/customer.service';
import { PaymentService } from '../../services/payment.service';
import { FlightTimeService } from '../../services/flight-time.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  customers: Customer[] = [];
  payments: Payment[] = [];
  flightTimes: FlightTime[] = [];

  stats = {
    totalReservations: 0,
    todayFlights: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    revenueGrowth: 15.5 // Dummy data for visual
  };

  todayReservations: Reservation[] = [];
  todayDate: Date = new Date();

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private paymentService: PaymentService,
    private flightTimeService: FlightTimeService,
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reservationService.getReservations().subscribe(res => {
      this.reservations = res;
      this.calculateStats();
    });
    this.customerService.getCustomers().subscribe(data => this.customers = data);
    this.paymentService.getPayments().subscribe(data => {
      this.payments = data;
      this.calculateStats();
    });
    this.flightTimeService.getFlightTimes().subscribe(data => this.flightTimes = data);
  }

  calculateStats(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.stats.totalReservations = this.reservations.length;
    
    this.todayReservations = this.reservations.filter(r => {
      const rDate = typeof r.flightDate === 'string' ? r.flightDate.split('T')[0] : new Date(r.flightDate).toISOString().split('T')[0];
      return rDate === today;
    });
    
    this.stats.todayFlights = this.todayReservations.length;
    this.stats.totalRevenue = this.payments.reduce((sum, p) => {
      const fromCode = this.getCurrencyCode(p.currency);
      const converted = this.currencyService.convert(Number(p.amount), fromCode, 'USD');
      return sum + converted;
    }, 0);
    this.stats.activeCustomers = this.customers.length;
  }

  getCurrencyCode(enumVal: any): string {
    switch(Number(enumVal)) {
      case PaymentCurrency.TL: return 'TRY';
      case PaymentCurrency.USD: return 'USD';
      case PaymentCurrency.EUR: return 'EUR';
      case PaymentCurrency.GBP: return 'GBP';
      default: return 'USD';
    }
  }

  getFlightTimeLabel(id: number): string {
    return this.flightTimes.find(ft => ft.id === id)?.time || '--:--';
  }

  getPassengersCount(res: Reservation): number {
    return res.details ? res.details.length : 0;
  }
}
