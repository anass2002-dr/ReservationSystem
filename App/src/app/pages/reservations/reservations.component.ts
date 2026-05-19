import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation, ReservationStatus, Customer, Pilot, FlightTime, Payment, PaymentCurrency } from '../../models/models';
import { ReservationService } from '../../services/reservation.service';
import { CustomerService } from '../../services/customer.service';
import { PilotService } from '../../services/pilot.service';
import { FlightTimeService } from '../../services/flight-time.service';
import { PaymentService } from '../../services/payment.service';
import { CurrencyService } from '../../services/currency.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  standalone: false,
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  customers: Customer[] = [];
  pilots: Pilot[] = [];
  flightTimes: FlightTime[] = [];
  payments: Payment[] = [];
  selectedFlightTimeId: number | null = null;
  groupedReservations: { flightTime: FlightTime, reservations: Reservation[] }[] = [];
  connectedLists: string[] = [];
  selectedDate: string = (() => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  })();

  activeTab: 'schedule' | 'list' = 'schedule';
  filterStatus: string = 'all';
  filterFlightTimeId: string = 'all';
  filterSearch: string = '';

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private pilotService: PilotService,
    private flightTimeService: FlightTimeService,
    private paymentService: PaymentService,
    private currencyService: CurrencyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLookups();
    this.loadReservations();
    this.loadPayments();
  }

  loadLookups(): void {
    this.customerService.getCustomers().subscribe(data => this.customers = data);
    this.pilotService.getPilots().subscribe(data => this.pilots = data);
    this.flightTimeService.getFlightTimes().subscribe(data => {
      this.flightTimes = data;
      this.updateConnectedLists();
      this.groupReservations();
    });
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe(data => this.payments = data);
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.groupReservations();
      },
      error: (err) => console.error('Error fetching reservations', err)
    });
  }

  updateConnectedLists(): void {
    this.connectedLists = this.flightTimes
      .filter(ft => ft.isActive)
      .map(ft => 'slot-' + ft.id);
  }

  groupReservations(): void {
    if (!this.flightTimes.length) return;

    // Filter by selected date
    const filtered = this.reservations.filter(r => {
      const rDateStr = typeof r.flightDate === 'string' 
        ? r.flightDate.split('T')[0] 
        : new Date(r.flightDate).toISOString().split('T')[0];
      return rDateStr === this.selectedDate;
    });

    // Group by flight time ID
    const groups: { flightTime: FlightTime, reservations: Reservation[] }[] = [];
    
    // Create groups for all active flight times
    this.flightTimes.filter(ft => ft.isActive).forEach(ft => {
      groups.push({
        flightTime: ft,
        reservations: filtered.filter(r => r.flightTimeId === ft.id)
      });
    });

    this.groupedReservations = groups;
  }

  previousDay(): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 1);
    this.selectedDate = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    this.groupReservations();
  }

  nextDay(): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 1);
    this.selectedDate = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    this.groupReservations();
  }

  get filteredListReservations(): Reservation[] {
    const currentDayFiltered = this.reservations.filter(r => {
      const rDateStr = typeof r.flightDate === 'string' 
        ? r.flightDate.split('T')[0] 
        : new Date(r.flightDate).toISOString().split('T')[0];
      return rDateStr === this.selectedDate;
    });

    return currentDayFiltered.filter(r => {
      // Status filter
      if (this.filterStatus !== 'all') {
        if (r.status.toString() !== this.filterStatus) return false;
      }
      
      // Flight Time filter
      if (this.filterFlightTimeId !== 'all') {
        if (r.flightTimeId?.toString() !== this.filterFlightTimeId) return false;
      }

      // Search filter
      if (this.filterSearch) {
        const query = this.filterSearch.toLowerCase();
        const resTitle = r.title?.toLowerCase() || '';
        const resId = r.id?.toString() || '';
        const passengers = this.getCustomersDisplay(r).toLowerCase();
        
        if (!resTitle.includes(query) && !resId.includes(query) && !passengers.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }

  hasRefund(res: Reservation): boolean {
    return this.payments && this.payments.some(p => p.reservationId === res.id && Number(p.amount) < 0);
  }

  getPassengersCount(res: Reservation): number {
    return res.details ? res.details.length : 0;
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

  isFullyPaid(res: Reservation): boolean {
    const totalDue = res.totalAmount || 0;
    const deposit = res.deposit || 0;
    const prefCurrency = res.preferredCurrency || PaymentCurrency.USD;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => {
        const fromCode = this.getCurrencyCode(p.currency);
        const toCode = this.getCurrencyCode(prefCurrency);
        const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
        return sum + converted;
      }, 0);
    return (paid + Number(deposit)) >= totalDue && totalDue > 0;
  }

  getRemainingBalance(res: Reservation): number {
    const totalDue = res.totalAmount || 0;
    const deposit = res.deposit || 0;
    const prefCurrency = res.preferredCurrency || PaymentCurrency.USD;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => {
        const fromCode = this.getCurrencyCode(p.currency);
        const toCode = this.getCurrencyCode(prefCurrency);
        const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
        return sum + converted;
      }, 0);
    return Math.max(0, totalDue - (paid + Number(deposit)));
  }

  getCustomersDisplay(r: Reservation): string {
    if (!r.details || r.details.length === 0) return 'No Customers';
    
    const firstCustomer = this.customers.find(x => x.id === r.details[0].customerId);
    const firstName = firstCustomer ? firstCustomer.fullName : 'Unknown';

    if (r.details.length === 1) {
      return firstName;
    } else {
      return `${firstName} (+${r.details.length - 1} more)`;
    }
  }

  getPilotsDisplay(r: Reservation): string {
    if (!r.details || r.details.length === 0) return 'No Pilots';
    
    // Get unique pilot IDs to avoid "Pilot A (+1 more)" if both passengers have Pilot A
    const uniquePilotIds = [...new Set(r.details.map(d => d.pilotId))];
    const firstPilot = this.pilots.find(x => x.id === uniquePilotIds[0]);
    const firstName = firstPilot ? firstPilot.fullName : 'Unknown';

    if (uniquePilotIds.length === 1) {
      return firstName;
    } else {
      return `${firstName} (+${uniquePilotIds.length - 1} more)`;
    }
  }

  getCurrencyLabel(currency: number): string {
    switch (currency) {
      case 0: return 'TL';
      case 1: return 'USD';
      case 2: return 'EUR';
      case 3: return 'GBP';
      default: return 'USD';
    }
  }

  getStatusBadgeClass(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.Pending: return 'bg-warning text-dark';
      case ReservationStatus.Confirmed: return 'bg-success';
      case ReservationStatus.Cancelled: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: ReservationStatus): string {
    switch (status) {
      case ReservationStatus.Pending: return 'Pending';
      case ReservationStatus.Confirmed: return 'Confirmed';
      case ReservationStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  addReservation(): void {
    this.router.navigate(['/reservations/add']);
  }

  editReservation(r: Reservation): void {
    this.router.navigate(['/reservations/edit', r.id]);
  }

  printReservation(r: Reservation): void {
    this.reservationService.getReservation(r.id!).subscribe(fullRes => {
      this.showPrintModal(fullRes);
    });
  }

  showPrintModal(res: Reservation): void {
    const modalHtml = `
      <div id="printModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: 'Segoe UI', sans-serif;">
        <div style="background: white; padding: 30px; border-radius: 20px; width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center;">
          <h3 style="margin-bottom: 10px; color: #333;">Print Options</h3>
          <p style="color: #666; margin-bottom: 25px;">Choose your preferred document format</p>
          
          <div style="display: grid; gap: 15px;">
            <button id="printA5" style="background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; border: none; padding: 15px; border-radius: 12px; cursor: pointer; font-weight: bold; transition: all 0.2s;">
              <i class="bi bi-file-earmark-text" style="margin-right: 8px;"></i> A5 Professional Voucher
            </button>
            <button id="printThermal" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; border: none; padding: 15px; border-radius: 12px; cursor: pointer; font-weight: bold; transition: all 0.2s;">
              <i class="bi bi-printer" style="margin-right: 8px;"></i> Sewoo Thermal Receipt (80mm)
            </button>
            <button id="closePrintModal" style="background: #f8f9fa; color: #333; border: 1px solid #ddd; padding: 12px; border-radius: 12px; cursor: pointer; margin-top: 10px;">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);

    document.getElementById('printA5')?.addEventListener('click', () => {
      this.executePrint(res, 'A5');
      document.body.removeChild(wrapper);
    });

    document.getElementById('printThermal')?.addEventListener('click', () => {
      this.executePrint(res, 'Thermal');
      document.body.removeChild(wrapper);
    });

    document.getElementById('closePrintModal')?.addEventListener('click', () => {
      document.body.removeChild(wrapper);
    });
  }

  executePrint(fullRes: Reservation, mode: 'A5' | 'Thermal'): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const flightTimeLabel = this.flightTimes.find(f => f.id === fullRes.flightTimeId)?.time || 'N/A';
    const statusLabel = this.getStatusLabel(fullRes.status);
    const totalAmount = fullRes.isAgencyBooking ? (fullRes.agencyPrice || 0) : (fullRes.totalAmount || 0);
    const deposit = fullRes.deposit || 0;
    
    const paidFromPayments = this.payments
      .filter(p => p.reservationId === fullRes.id)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const totalPaid = Number(paidFromPayments) + Number(deposit);
    const restToPay = Math.max(0, totalAmount - totalPaid);

    // Get payment details from the first payment record, or fallback to reservation preference
    const firstPayment = this.payments.find(p => p.reservationId === fullRes.id);
    const payMethod = firstPayment ? (firstPayment.method === 1 ? 'CARD' : 'CASH') : 'CASH';
    const payCurrency = firstPayment ? this.getCurrencyLabel(firstPayment.currency) : this.getCurrencyLabel(fullRes.preferredCurrency || 0);

    if (mode === 'A5') {
      const passengersHtml = fullRes.details.map((d, i) => `
        <div class="passenger-item">
          <div class="p-header">Passenger ${i + 1}: ${d.customer?.fullName || 'N/A'}</div>
          <div class="p-grid">
            <div><strong>Phone:</strong> ${d.customer?.phoneNumber || 'N/A'}</div>
            <div><strong>Country:</strong> ${d.customer?.country || 'N/A'}</div>
            <div><strong>Pilot:</strong> ${this.pilots.find(p => p.id === d.pilotId)?.fullName || 'Pending'}</div>
            <div><strong>Package:</strong> ${this.flightTimes.find(ft => ft.id === fullRes.flightTimeId) ? 'Standard' : 'N/A'}</div>
          </div>
        </div>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Reservation #${fullRes.id}</title>
            <style>
              @page { size: A5 landscape; margin: 0; }
              body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; color: #333; font-size: 12px; }
              .ticket { border: 2px solid #0d6efd; border-radius: 15px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
              .header { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
              .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; }
              .content { padding: 15px; flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .section-title { border-bottom: 2px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; color: #0d6efd; text-transform: uppercase; font-size: 10px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
              .info-item strong { color: #666; font-size: 9px; display: block; }
              .passengers { grid-column: span 2; }
              .passenger-item { background: #f8f9fa; border-radius: 8px; padding: 8px; margin-bottom: 8px; border-left: 3px solid #0d6efd; }
              .p-header { font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #dee2e6; }
              .p-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 5px; font-size: 10px; }
              .footer { background: #f1f3f5; padding: 10px 20px; display: flex; justify-content: space-between; border-top: 1px solid #dee2e6; }
              .price-val { font-weight: bold; color: #0d6efd; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <div><h1>Flight Voucher</h1><div style="font-size: 10px;">#${fullRes.id} | ${new Date().toLocaleDateString()}</div></div>
                <div style="text-align: right"><strong>${fullRes.title || 'Paragliding'}</strong><div>Status: ${statusLabel}</div></div>
              </div>
              <div class="content">
                <div><div class="section-title">Flight Details</div><div class="info-grid">
                  <div class="info-item"><strong>Date</strong>${new Date(fullRes.flightDate).toLocaleDateString()}</div>
                  <div class="info-item"><strong>Time</strong>${flightTimeLabel}</div>
                  <div class="info-item"><strong>Pickup</strong>${fullRes.pickupLocation || 'No Pickup'}</div>
                  <div class="info-item"><strong>Booking</strong>${fullRes.isAgencyBooking ? 'Agency: ' + (fullRes.agencyName || 'N/A') : 'Direct'}</div>
                  <div class="info-item"><strong>Created By</strong>${fullRes.createdBy || 'System'}</div>
                </div></div>
                <div><div class="section-title">Payment (${payCurrency})</div><div class="info-grid">
                  <div class="info-item"><strong>Total</strong>${totalAmount.toFixed(2)} ${payCurrency}</div>
                  <div class="info-item"><strong>Paid</strong>${totalPaid.toFixed(2)} ${payCurrency}</div>
                  <div class="info-item"><strong>Rest</strong>${restToPay.toFixed(2)} ${payCurrency}</div>
                  <div class="info-item" style="color: ${restToPay <= 0 ? 'green' : 'red'}; font-weight: bold;">
                    <strong>Method: ${payMethod}</strong>${restToPay <= 0 ? ' PAID' : ' DUE'}
                  </div>
                </div></div>
                <div class="passengers"><div class="section-title">Passengers</div>${passengersHtml}</div>
              </div>
              <div class="footer">
                <div style="font-size: 9px;">Gravity Paragliding | Fethiye, Turkey</div>
                <div style="text-align: right"><div>Rest to Pay</div><div class="price-val">${restToPay.toFixed(2)} ${payCurrency}</div></div>
              </div>
            </div>
            <script>window.onload = function() { window.print(); };</script>
          </body>
        </html>
      `);
    } else {
      // Thermal Sewoo SLK-TL322 Mode (80mm width)
      const passengersList = fullRes.details.map((d, i) => `
        <div style="border-bottom: 1px dashed #000; padding: 5px 0;">
          P${i+1}: ${d.customer?.fullName || 'N/A'}<br>
          <small>Pilot: ${this.pilots.find(p => p.id === d.pilotId)?.fullName || 'Pending'}</small>
        </div>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket #${fullRes.id}</title>
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
              <div>#${fullRes.id}</div>
            </div>
            <div class="sep"></div>
            <div class="row"><span>DATE:</span><span>${new Date(fullRes.flightDate).toLocaleDateString()}</span></div>
            <div class="row"><span>TIME:</span><span>${flightTimeLabel}</span></div>
            <div class="row"><span>PICKUP:</span><span>${fullRes.pickupLocation || 'None'}</span></div>
            <div class="sep"></div>
            <div class="bold">PASSENGERS:</div>
            ${passengersList}
            <div class="sep"></div>
            <div class="row bold"><span>TOTAL:</span><span>${totalAmount.toFixed(2)} ${payCurrency}</span></div>
            <div class="row"><span>PAID:</span><span>${totalPaid.toFixed(2)} ${payCurrency}</span></div>
            <div class="row bold" style="font-size: 14px;"><span>REST:</span><span>${restToPay.toFixed(2)} ${payCurrency}</span></div>
            <div class="row"><span>METHOD:</span><span>${payMethod}</span></div>
            <div class="row"><span>CREATED BY:</span><span>${fullRes.createdBy || 'System'}</span></div>
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
    }
    printWindow.document.close();
  }

  onDrop(event: CdkDragDrop<Reservation[]>, targetFlightTimeId: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const reservation = event.previousContainer.data[event.previousIndex];
      const previousFlightTimeId = reservation.flightTimeId;
      
      // Update locally for immediate feedback
      reservation.flightTimeId = targetFlightTimeId;
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Persist to backend
      this.reservationService.updateReservation(reservation.id!, reservation).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Moved to ${this.flightTimes.find(f => f.id === targetFlightTimeId)?.time}`,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err) => {
          console.error('Error updating reservation time', err);
          // Rollback local change on error
          reservation.flightTimeId = previousFlightTimeId;
          this.loadReservations();
          Swal.fire('Error', 'Failed to update reservation time', 'error');
        }
      });
    }
  }

  getConnectedList(): string[] {
    return this.flightTimes.map(ft => 'slot-' + ft.id);
  }

  deleteReservation(id: number): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => this.loadReservations(),
        error: (err) => console.error('Error deleting reservation', err)
      });
    }
  }
}
