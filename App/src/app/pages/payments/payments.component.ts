import { Component, OnInit } from '@angular/core';
import { Reservation, Payment, PaymentCurrency, PaymentMethod, FlightTime } from '../../models/models';
import { PaymentService } from '../../services/payment.service';
import { ReservationService } from '../../services/reservation.service';
import { FlightTimeService } from '../../services/flight-time.service';
import { CurrencyService } from '../../services/currency.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  reservations: Reservation[] = [];
  flightTimes: FlightTime[] = [];
  
  selectedDate: string = (() => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  })();

  activeTab: 'collect' | 'records' = 'collect';

  // Advanced Filters
  filterStartDate: string = '';
  filterEndDate: string = '';
  filterMethod: string = 'all';
  filterCurrency: string = 'all';
  filterSearch: string = '';
  
  PaymentCurrency = PaymentCurrency;
  PaymentMethod = PaymentMethod;
  
  currencyOptions = [
    { value: PaymentCurrency.USD, label: 'USD' },
    { value: PaymentCurrency.EUR, label: 'EUR' },
    { value: PaymentCurrency.TL, label: 'TRY' },
    { value: PaymentCurrency.GBP, label: 'GBP' }
  ];
  
  methodOptions = [
    { value: PaymentMethod.Cash, label: 'Cash' },
    { value: PaymentMethod.Card, label: 'Card' },
    { value: PaymentMethod.Transfer, label: 'Transfer/IBAN' }
  ];

  private modal: any;
  
  selectedReservation: Reservation | null = null;
  currentPayment: Payment = this.createEmptyPayment();
  
  isEditing = false;
  
  totalAmountDue = 0;
  amountPaid = 0;
  remainingBalance = 0;

  get filteredPayments(): Payment[] {
    return this.payments.filter(p => {
      // Date filter
      if (this.filterStartDate) {
        const pDate = p.paymentDate.toString().split('T')[0];
        if (pDate < this.filterStartDate) return false;
      }
      if (this.filterEndDate) {
        const pDate = p.paymentDate.toString().split('T')[0];
        if (pDate > this.filterEndDate) return false;
      }
      // Method filter
      if (this.filterMethod !== 'all') {
        if (p.method.toString() !== this.filterMethod) return false;
      }
      // Currency filter
      if (this.filterCurrency !== 'all') {
        if (p.currency.toString() !== this.filterCurrency) return false;
      }
      // Search filter
      if (this.filterSearch) {
        const query = this.filterSearch.toLowerCase();
        const res = this.reservations.find(r => r.id === p.reservationId);
        const resTitle = res?.title?.toLowerCase() || '';
        const resId = p.reservationId.toString();
        const passengers = res?.details?.map(d => d.customer?.fullName.toLowerCase() || '').join(' ') || '';
        if (!resTitle.includes(query) && !resId.includes(query) && !passengers.includes(query)) return false;
      }
      return true;
    });
  }

  getFilteredTotal(currency: PaymentCurrency): number {
    return this.filteredPayments
      .filter(p => Number(p.currency) === currency)
      .reduce((sum, p) => sum + Number(p.amount), 0);
  }

  getReservationTitle(id: number): string {
    const res = this.reservations.find(r => r.id === id);
    return res ? (res.title || `Reservation #${id}`) : `Reservation #${id}`;
  }

  getReservationPassengers(id: number): string {
    const res = this.reservations.find(r => r.id === id);
    if (!res || !res.details) return '';
    return res.details.map(d => d.customer?.fullName).join(', ');
  }

  deletePaymentRecord(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this payment record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentService.deletePayment(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Payment record has been deleted.', 'success');
            this.loadPayments();
            this.loadReservations();
          },
          error: (err) => {
            console.error('Error deleting payment', err);
            Swal.fire('Error', 'Failed to delete payment record.', 'error');
          }
        });
      }
    });
  }


  constructor(
    private paymentService: PaymentService,
    private reservationService: ReservationService,
    private flightTimeService: FlightTimeService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadFlightTimes();
    this.loadPayments();
    this.loadReservations();
  }

  loadFlightTimes(): void {
    this.flightTimeService.getFlightTimes().subscribe({
      next: (data) => this.flightTimes = data,
      error: (err) => console.error('Error fetching flight times', err)
    });
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => this.payments = data,
      error: (err) => console.error('Error fetching payments', err)
    });
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Error fetching reservations', err)
    });
  }

  get groupedReservations() {
    // Filter by selected date
    const filtered = this.reservations.filter(r => {
      const rDateStr = typeof r.flightDate === 'string' 
        ? r.flightDate.split('T')[0] 
        : new Date(r.flightDate).toISOString().split('T')[0];
      return rDateStr === this.selectedDate;
    });

    // Group by flight time ID
    const groups: { flightTime: FlightTime, reservations: Reservation[] }[] = [];
    
    // Create groups for all active flight times to keep the layout consistent
    this.flightTimes.filter(ft => ft.isActive).forEach(ft => {
      groups.push({
        flightTime: ft,
        reservations: filtered.filter(r => r.flightTimeId === ft.id)
      });
    });

    return groups;
  }

  getPassengersCount(res: Reservation): number {
    return res.details ? res.details.length : 0;
  }

  isFullyPaid(res: Reservation): boolean {
    const totalDue = res.totalAmount || 0;
    const deposit = res.deposit || 0;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return (paid + deposit) >= totalDue && totalDue > 0;
  }

  openPaymentModal(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.isEditing = false;
    this.currentPayment = this.createEmptyPayment();
    this.currentPayment.reservationId = reservation.id!;
    
    // Auto-select the reservation's preferred currency
    if (reservation.preferredCurrency !== undefined) {
      this.currentPayment.currency = reservation.preferredCurrency;
    }
    
    this.calculateBalances();
    
    this.showModal();
  }

  calculateBalances(): void {
    if (!this.selectedReservation) return;
    
    this.totalAmountDue = this.selectedReservation.totalAmount || 0;
    const deposit = this.selectedReservation.deposit || 0;
    
    // Sum payments for this reservation
    const relatedPayments = this.payments.filter(p => p.reservationId === this.selectedReservation!.id);
    this.amountPaid = relatedPayments.reduce((sum, p) => sum + Number(p.amount), 0) + deposit;
    
    this.remainingBalance = Math.max(0, this.totalAmountDue - this.amountPaid);
  }

  setPayAll(): void {
    this.currentPayment.amount = this.remainingBalance;
  }

  getConvertedAmount(): number {
    if (!this.currentPayment.amount || !this.selectedReservation) return 0;
    
    const baseCurrency = this.getCurrencyCode(this.selectedReservation.preferredCurrency || PaymentCurrency.USD);
    const payCurrency = this.getCurrencyCode(this.currentPayment.currency);
    
    // Convert from payment currency to reservation preferred currency
    return this.currencyService.convert(this.currentPayment.amount, payCurrency, baseCurrency);
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

  createEmptyPayment(): Payment {
    return {
      amount: 0,
      currency: PaymentCurrency.USD,
      method: PaymentMethod.Cash,
      paymentDate: new Date().toISOString().split('T')[0],
      reservationId: 0,
      notes: ''
    };
  }

  savePayment(): void {
    this.currentPayment.amount = Number(this.currentPayment.amount);
    this.currentPayment.currency = Number(this.currentPayment.currency);
    this.currentPayment.method = Number(this.currentPayment.method);
    this.currentPayment.reservationId = Number(this.currentPayment.reservationId);

    if (this.isEditing && this.currentPayment.id) {
      this.paymentService.updatePayment(this.currentPayment.id, this.currentPayment).subscribe({
        next: () => {
          this.loadPayments();
          this.hideModal();
        },
        error: (err) => console.error('Error updating payment', err)
      });
    } else {
      this.paymentService.addPayment(this.currentPayment).subscribe({
        next: () => {
          this.loadPayments();
          this.hideModal();
        },
        error: (err) => console.error('Error adding payment', err)
      });
    }
  }

  private showModal(): void {
    if (!this.modal) {
      const el = document.getElementById('paymentModal');
      this.modal = new bootstrap.Modal(el);
    }
    this.modal.show();
  }

  private hideModal(): void {
    if (this.modal) {
      this.modal.hide();
      this.selectedReservation = null;
    }
  }
}


