import { Component, OnInit } from '@angular/core';
import { Reservation, Payment, PaymentCurrency, PaymentMethod, FlightTime, Agency, Pilot, FlightPackage } from '../../models/models';
import { PaymentService } from '../../services/payment.service';
import { ReservationService } from '../../services/reservation.service';
import { FlightTimeService } from '../../services/flight-time.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { PilotService } from '../../services/pilot.service';
import { AgencyService } from '../../services/agency.service';
import { FlightPackageService } from '../../services/flight-package.service';
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
  pilots: Pilot[] = [];
  agencies: Agency[] = [];
  flightPackages: FlightPackage[] = [];

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
  isRefundMode = false;

  totalAmountDue = 0;
  amountPaid = 0;
  remainingBalance = 0;
  amountInPayCurrency = 0;
  exchangeRate = 1;
  convertedAmount = 0;

  getRemainingBalanceForRes(res: Reservation): number {
    const totalDue = res.totalAmount || 0;
    const deposit = res.deposit || 0;
    const prefCurrency = res.preferredCurrency !== undefined ? Number(res.preferredCurrency) : PaymentCurrency.USD;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => {
        const fromCode = this.getCurrencyCode(p.currency);
        const toCode = this.getCurrencyCode(prefCurrency);
        const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
        return sum + converted;
      }, 0);
    return Math.max(0, Number((totalDue - (paid + deposit)).toFixed(2)));
  }

  getCurrencyLabel(currency: number): string {
    switch (Number(currency)) {
      case 0: return 'TRY';
      case 1: return 'USD';
      case 2: return 'EUR';
      case 3: return 'GBP';
      default: return 'USD';
    }
  }

  get filteredTransactions(): any[] {
    const items: any[] = [];

    // Add regular payments
    this.payments.forEach(p => {
      items.push({
        id: p.id,
        isDeposit: false,
        isUnpaid: false,
        paymentDate: p.paymentDate,
        reservationId: p.reservationId,
        amount: p.amount,
        currency: p.currency,
        method: p.method,
        notes: p.notes || ''
      });
    });

    // Add deposits
    this.reservations.forEach(r => {
      if (r.deposit && r.deposit > 0) {
        items.push({
          isDeposit: true,
          isUnpaid: false,
          paymentDate: r.createdAt || r.flightDate,
          reservationId: r.id!,
          amount: r.deposit,
          currency: r.preferredCurrency !== undefined ? Number(r.preferredCurrency) : PaymentCurrency.USD,
          method: r.depositMethod !== undefined ? Number(r.depositMethod) : PaymentMethod.Cash,
          notes: 'Deposit Payment'
        });
      }
    });

    // Add unpaid/due balances
    this.reservations.forEach(r => {
      const unpaid = this.getRemainingBalanceForRes(r);
      if (unpaid > 0 && r.status !== 2) {
        items.push({
          isDeposit: false,
          isUnpaid: true,
          paymentDate: r.flightDate,
          reservationId: r.id!,
          amount: unpaid,
          currency: r.preferredCurrency !== undefined ? Number(r.preferredCurrency) : PaymentCurrency.USD,
          method: -1,
          notes: 'Non Paid (Due)'
        });
      }
    });

    // Apply advanced filters
    return items.filter(item => {
      // Date filter
      if (this.filterStartDate) {
        const itemDate = item.paymentDate.toString().split('T')[0];
        if (itemDate < this.filterStartDate) return false;
      }
      if (this.filterEndDate) {
        const itemDate = item.paymentDate.toString().split('T')[0];
        if (itemDate > this.filterEndDate) return false;
      }
      // Method filter
      if (this.filterMethod !== 'all') {
        if (item.method.toString() !== this.filterMethod) return false;
      }
      // Currency filter
      if (this.filterCurrency !== 'all') {
        if (item.currency.toString() !== this.filterCurrency) return false;
      }
      // Search filter
      if (this.filterSearch) {
        const query = this.filterSearch.toLowerCase();
        const res = this.reservations.find(r => r.id === item.reservationId);
        const resTitle = res?.title?.toLowerCase() || '';
        const resId = item.reservationId.toString();
        const passengers = res?.details?.map(d => d.customer?.fullName.toLowerCase() || '').join(' ') || '';
        if (!resTitle.includes(query) && !resId.includes(query) && !passengers.includes(query)) return false;
      }
      return true;
    }).sort((a, b) => {
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    });
  }

  getFilteredTotal(currency: PaymentCurrency): number {
    return this.filteredTransactions
      .filter(t => !t.isUnpaid && Number(t.currency) === currency)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  printThermalBill(reservationId: number): void {
    const res = this.reservations.find(r => r.id === reservationId);
    if (!res) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const flightTimeLabel = this.flightTimes.find(f => f.id === res.flightTimeId)?.time || 'N/A';
    const totalAmount = res.isAgencyBooking ? (res.agencyPrice || 0) : (res.totalAmount || 0);
    const deposit = res.deposit || 0;
    const prefCurrency = (res.preferredCurrency !== undefined && res.preferredCurrency !== null)
      ? Number(res.preferredCurrency)
      : PaymentCurrency.USD;

    // Calculate total paid with currency conversion
    const paidFromPayments = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => {
        const fromCode = this.getCurrencyCode(p.currency);
        const toCode = this.getCurrencyCode(prefCurrency);
        const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
        return sum + converted;
      }, 0);

    const totalPaid = Number((paidFromPayments + Number(deposit)).toFixed(2));
    const restToPay = Math.max(0, Number((totalAmount - totalPaid).toFixed(2)));

    const agencyName = res.isAgencyBooking ? (this.agencies.find(a => a.id === res.agencyId)?.name || 'Agency') : '';

    // Get payment details from the first payment record, or fallback to reservation preference
    const firstPayment = this.payments.find(p => p.reservationId === res.id);
    const payMethod = firstPayment ? (firstPayment.method === 1 ? 'CARD' : (firstPayment.method === 2 ? 'TRANSFER' : 'CASH')) : (res.depositMethod === 1 ? 'CARD' : (res.depositMethod === 2 ? 'TRANSFER' : 'CASH'));
    const payCurrency = this.getCurrencyLabel(prefCurrency);

    const passengersList = res.details ? res.details.map((d, i) => `
      <div style="border-bottom: 1px dashed #000; padding: 5px 0;">
        P${i + 1}: ${d.customer?.fullName || 'N/A'}<br>
        <small>Pilot: ${this.pilots.find(p => p.id === d.pilotId)?.fullName || 'Pending'}</small>
      </div>
    `).join('') : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket #${res.id}</title>
          <style>
            @page { size: 80mm 200mm; margin: 0; }
            body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 10px; width: 72mm; color: #000; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .sep { border-bottom: 1px solid #000; margin: 5px 0; }
            .row { display: flex; justify-content: space-between; }
            h2 { margin: 5px 0; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2>GRAVITY PARAGLIDING</h2>
            <div style="font-size: 10px;">FETHIYE / OLUDENIZ</div>
            <div class="sep"></div>
            <div class="bold">BOOKING VOUCHER</div>
            <div>#${res.id}</div>
          </div>
          <div class="sep"></div>
          <div class="row"><span>DATE:</span><span>${res.flightDate ? new Date(res.flightDate).toLocaleDateString('en-GB') : 'N/A'}</span></div>
          <div class="row"><span>TIME:</span><span>${flightTimeLabel}</span></div>
          <div class="row"><span>PICKUP:</span><span>${res.pickupLocation || 'None'}</span></div>
          ${res.isAgencyBooking ? `<div class="row"><span>AGENCY:</span><span>${agencyName}</span></div>` : ''}
          ${res.isAgencyBooking && res.billetNumber ? `<div class="row"><span>BILLET NO:</span><span>${res.billetNumber}</span></div>` : ''}
          <div class="sep"></div>
          <div class="bold">PASSENGERS:</div>
          ${passengersList}
          <div class="sep"></div>
          <div class="row"><span>METHOD:</span><span class="bold">${payMethod}</span></div>
          <div class="row bold"><span>TOTAL:</span><span>${totalAmount.toFixed(2)} ${payCurrency}</span></div>
          <div class="row"><span>PAID:</span><span>${totalPaid.toFixed(2)} ${payCurrency}</span></div>
          <div class="row bold" style="font-size: 14px;"><span>REST:</span><span>${restToPay.toFixed(2)} ${payCurrency}</span></div>
          <div class="row"><span>CREATED BY:</span><span>${res.createdBy || 'System'}</span></div>
          <div class="sep"></div>
          <div class="center bold" style="font-size: 12px; margin-top: 5px;">
            ${restToPay <= 0 ? '*** PAID ***' : '*** BALANCE DUE ***'}
          </div>
          <div class="sep"></div>
          <div class="center" style="font-size: 9px; margin-top: 10px;">
            Please be ready 15 mins early.<br>
            Contact: +90 5XX XXX XX XX<br>
            Enjoy your flight!
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

  getReservationAgency(id: number): string | null {
    const res = this.reservations.find(r => r.id === id);
    if (!res || !res.isAgencyBooking) return null;
    if (res.agencyName) return res.agencyName;
    if (res.agencyId && this.agencies) {
      const agency = this.agencies.find(a => a.id === res.agencyId);
      return agency ? agency.name : 'Agency';
    }
    return 'Agency';
  }

  openPaymentForRecord(record: any): void {
    const res = this.reservations.find(r => r.id === record.reservationId);
    if (res) {
      this.openPaymentModal(res);
    }
  }

  isRecordFullyPaid(record: any): boolean {
    const res = this.reservations.find(r => r.id === record.reservationId);
    if (!res) return true;
    return this.getRemainingBalanceForRes(res) <= 0;
  }

  editReservation(id: number): void {
    this.router.navigate(['/reservations/edit', id]);
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
    private currencyService: CurrencyService,
    private pilotService: PilotService,
    private agencyService: AgencyService,
    private flightPackageService: FlightPackageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFlightTimes();
    this.loadPayments();
    this.loadReservations();
    this.loadLookups();
  }

  loadLookups(): void {
    this.pilotService.getPilots().subscribe({
      next: (data) => this.pilots = data,
      error: (err) => console.error('Error fetching pilots', err)
    });
    this.agencyService.getAgencies().subscribe({
      next: (data) => this.agencies = data,
      error: (err) => console.error('Error fetching agencies', err)
    });
    this.flightPackageService.getFlightPackages().subscribe({
      next: (data) => this.flightPackages = data,
      error: (err) => console.error('Error fetching packages', err)
    });
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
      next: (data) => {
        this.reservations = data;

        // Auto-open payment modal if navigated from another page
        const resIdStr = this.route.snapshot.queryParams['id'];
        if (resIdStr) {
          const resId = Number(resIdStr);
          const resToOpen = this.reservations.find(r => r.id === resId);
          if (resToOpen) {
            // Slight delay to ensure UI is ready
            setTimeout(() => this.openPaymentModal(resToOpen), 100);
          }
        }
      },
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

  trackByGroup(index: number, group: { flightTime: FlightTime, reservations: Reservation[] }): number {
    return group.flightTime.id!;
  }

  trackByReservation(index: number, res: Reservation): number {
    return res.id!;
  }

  trackByTransaction(index: number, record: any): any {
    return record.id || record.reservationId || index;
  }

  previousCurrency: PaymentCurrency = PaymentCurrency.USD;

  isFullyPaid(res: Reservation): boolean {
    const totalDue = res.totalAmount || 0;
    const deposit = res.deposit || 0;
    const prefCurrency = (res.preferredCurrency !== undefined && res.preferredCurrency !== null)
      ? Number(res.preferredCurrency)
      : PaymentCurrency.USD;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => {
        const fromCode = this.getCurrencyCode(p.currency);
        const toCode = this.getCurrencyCode(prefCurrency);
        const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
        return sum + converted;
      }, 0);
    return Number((paid + deposit).toFixed(2)) >= totalDue && totalDue > 0;
  }

  getAmountPaidForRes(res: Reservation): number {
    const deposit = res.deposit || 0;
    const prefCurrency = (res.preferredCurrency !== undefined && res.preferredCurrency !== null)
      ? Number(res.preferredCurrency)
      : PaymentCurrency.USD;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => {
        const fromCode = this.getCurrencyCode(p.currency);
        const toCode = this.getCurrencyCode(prefCurrency);
        const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
        return sum + converted;
      }, 0);
    return Number((paid + deposit).toFixed(2));
  }

  hasRefund(res: Reservation): boolean {
    return this.payments && this.payments.some(p => p.reservationId === res.id && Number(p.amount) < 0);
  }

  openPaymentModal(reservation: Reservation): void {
    try {
      // console.log(reservation);
      this.selectedReservation = reservation;
      this.isEditing = false;
      this.currentPayment = this.createEmptyPayment();
      this.currentPayment.reservationId = reservation.id!;

      // Auto-select the reservation's preferred currency
      if (reservation.preferredCurrency !== undefined && reservation.preferredCurrency !== null) {
        this.currentPayment.currency = reservation.preferredCurrency;
      } else {
        this.currentPayment.currency = PaymentCurrency.USD;
      }
      this.previousCurrency = this.currentPayment.currency;

      this.calculateBalances();
      this.isRefundMode = (reservation.status === 2 && this.amountPaid > 0);
      this.updateExchangeRates();

      if (this.isRefundMode) {
        this.convertedAmount = this.amountPaid;
      } else {
        this.convertedAmount = this.remainingBalance;
      }
      this.amountInPayCurrency = Number((this.convertedAmount * this.exchangeRate).toFixed(2));

      this.showModal();
    } catch (e: any) {
      console.error('Error in openPaymentModal:', e);
      alert('Error opening payment modal: ' + (e?.message || String(e)));
    }
  }

  calculateBalances(): void {
    if (!this.selectedReservation) return;

    this.totalAmountDue = this.selectedReservation.totalAmount || 0;
    const deposit = this.selectedReservation.deposit || 0;

    // Sum payments for this reservation, converting each to reservation's preferred currency
    const relatedPayments = this.payments.filter(p => p.reservationId === this.selectedReservation!.id);
    const prefCurrency = (this.selectedReservation.preferredCurrency !== undefined && this.selectedReservation.preferredCurrency !== null)
      ? Number(this.selectedReservation.preferredCurrency)
      : PaymentCurrency.USD;

    const rawPaid = relatedPayments.reduce((sum, p) => {
      const fromCode = this.getCurrencyCode(p.currency);
      const toCode = this.getCurrencyCode(prefCurrency);
      const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
      return sum + converted;
    }, 0) + deposit;

    this.amountPaid = Number(rawPaid.toFixed(2));
    this.remainingBalance = Math.max(0, Number((this.totalAmountDue - this.amountPaid).toFixed(2)));
  }

  setPayAll(): void {
    if (this.isRefundMode) {
      this.convertedAmount = this.amountPaid;
    } else {
      this.convertedAmount = this.remainingBalance;
    }
    this.amountInPayCurrency = Number((this.convertedAmount * this.exchangeRate).toFixed(2));
  }

  onCurrencyChange(newCurrency: any): void {
    this.currentPayment.currency = Number(newCurrency);
    this.updateExchangeRates();
    this.amountInPayCurrency = Number((this.convertedAmount * this.exchangeRate).toFixed(2));
  }

  updateExchangeRates(): void {
    if (!this.selectedReservation) return;

    const prefCurrency = (this.selectedReservation.preferredCurrency !== undefined && this.selectedReservation.preferredCurrency !== null)
      ? Number(this.selectedReservation.preferredCurrency)
      : PaymentCurrency.USD;

    const payCurrency = Number(this.currentPayment.currency);

    if (prefCurrency === payCurrency) {
      this.exchangeRate = 1;
    } else {
      const fromCode = this.getCurrencyCode(prefCurrency);
      const toCode = this.getCurrencyCode(payCurrency);
      this.exchangeRate = Number(this.currencyService.convert(1, fromCode, toCode).toFixed(4));
    }
  }

  onAmountInPayCurrencyChange(): void {
    if (this.exchangeRate > 0) {
      this.convertedAmount = Number((this.amountInPayCurrency / this.exchangeRate).toFixed(2));
    }
  }

  onExchangeRateChange(): void {
    if (this.exchangeRate > 0) {
      this.convertedAmount = Number((this.amountInPayCurrency / this.exchangeRate).toFixed(2));
    }
  }

  onConvertedAmountChange(): void {
    this.amountInPayCurrency = Number((this.convertedAmount * this.exchangeRate).toFixed(2));
  }


  getCurrencyCode(enumVal: any): string {
    switch (Number(enumVal)) {
      case PaymentCurrency.TL: return 'TRY';
      case PaymentCurrency.USD: return 'USD';
      case PaymentCurrency.EUR: return 'EUR';
      case PaymentCurrency.GBP: return 'GBP';
      default: return 'USD';
    }
  }

  getLocalDatetimeString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  createEmptyPayment(): Payment {
    return {
      amount: 0,
      currency: PaymentCurrency.USD,
      method: PaymentMethod.Cash,
      paymentDate: this.getLocalDatetimeString(),
      reservationId: 0,
      notes: ''
    };
  }

  savePayment(): void {
    if (!this.selectedReservation) return;

    let payAmount = Number(this.amountInPayCurrency);

    if (this.isRefundMode) {
      // Save amount as negative decimal
      payAmount = -Math.abs(payAmount);
      if (!this.currentPayment.notes || !this.currentPayment.notes.includes('[Refund]')) {
        this.currentPayment.notes = `[Refund] ${this.currentPayment.notes || ''}`.trim();
      }
    }

    this.currentPayment.amount = Number(payAmount.toFixed(2));
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
    try {
      if (!this.modal) {
        const el = document.getElementById('paymentModal');
        if (!el) {
          console.error('Modal element #paymentModal not found in DOM!');
          alert('Error: Modal element not found on page.');
          return;
        }
        this.modal = new bootstrap.Modal(el);
      }
      this.modal.show();
    } catch (e: any) {
      console.error('Error showing modal:', e);
      alert('Error showing modal: ' + (e?.message || String(e)));
    }
  }

  private hideModal(): void {
    if (this.modal) {
      this.modal.hide();
      this.selectedReservation = null;
    }
  }
}


