import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Reservation, ReservationStatus, Customer, Pilot, FlightTime, Payment, PaymentCurrency, FlightPackage, ExtraService, TransportGroup, Agency } from '../../models/models';
import { ReservationService } from '../../services/reservation.service';
import { CustomerService } from '../../services/customer.service';
import { PilotService } from '../../services/pilot.service';
import { FlightTimeService } from '../../services/flight-time.service';
import { PaymentService } from '../../services/payment.service';
import { CurrencyService } from '../../services/currency.service';
import { FlightPackageService } from '../../services/flight-package.service';
import { ExtraServiceService } from '../../services/extra-service.service';
import { TransportGroupService } from '../../services/transport-group.service';
import { AgencyService } from '../../services/agency.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

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
  flightPackages: FlightPackage[] = [];
  extraServices: ExtraService[] = [];
  transportGroups: TransportGroup[] = [];
  agencies: Agency[] = [];
  selectedFlightTimeId: number | null = null;
  groupedReservations: { flightTime: FlightTime, reservations: Reservation[] }[] = [];
  connectedLists: string[] = [];
  selectedDate: string = (() => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  })();

  isLoading = false;

  activeTab: 'schedule' | 'list' = 'schedule';
  filterStatus: string = 'all';
  filterFlightTimeId: string = 'all';
  filterSearch: string = '';
  filterDateRange: string = 'day';

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private pilotService: PilotService,
    private flightTimeService: FlightTimeService,
    private paymentService: PaymentService,
    private currencyService: CurrencyService,
    private flightPackageService: FlightPackageService,
    private extraServiceService: ExtraServiceService,
    private transportGroupService: TransportGroupService,
    private agencyService: AgencyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    forkJoin({
      customers: this.customerService.getCustomers(),
      pilots: this.pilotService.getPilots(),
      flightTimes: this.flightTimeService.getFlightTimes(),
      packages: this.flightPackageService.getFlightPackages(),
      extras: this.extraServiceService.getExtraServices(),
      transports: this.transportGroupService.getTransportGroups(),
      agencies: this.agencyService.getAgencies(),
      payments: this.paymentService.getPayments(),
      reservations: this.reservationService.getReservations()
    }).subscribe({
      next: (res) => {
        this.customers = res.customers;
        this.pilots = res.pilots;
        this.flightTimes = res.flightTimes;
        this.flightPackages = res.packages;
        this.extraServices = res.extras;
        this.transportGroups = res.transports;
        this.agencies = res.agencies;
        this.payments = res.payments;
        this.reservations = res.reservations;

        this.updateConnectedLists();
        this.groupReservations();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.isLoading = false;
      }
    });
  }

  loadLookups(): void {
    this.customerService.getCustomers().subscribe(data => this.customers = data);
    this.pilotService.getPilots().subscribe(data => this.pilots = data);
    this.flightTimeService.getFlightTimes().subscribe(data => {
      this.flightTimes = data;
      this.updateConnectedLists();
      this.groupReservations();
    });
    this.flightPackageService.getFlightPackages().subscribe(data => this.flightPackages = data);
    this.extraServiceService.getExtraServices().subscribe(data => this.extraServices = data);
    this.transportGroupService.getTransportGroups().subscribe(data => this.transportGroups = data);
    this.agencyService.getAgencies().subscribe(data => this.agencies = data);
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe(data => this.payments = data);
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.groupReservations();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations', err);
        this.isLoading = false;
      }
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
    const parts = this.selectedDate.split('-');
    const baseLocal = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

    const currentDayFiltered = this.reservations.filter(r => {
      const rDate = new Date(r.flightDate);
      const rYear = rDate.getFullYear();
      const rMonth = rDate.getMonth();
      const rDay = rDate.getDate();
      const rLocal = new Date(rYear, rMonth, rDay);

      switch (this.filterDateRange) {
        case 'day': {
          const rDateStr = typeof r.flightDate === 'string' 
            ? r.flightDate.split('T')[0] 
            : rDate.toISOString().split('T')[0];
          return rDateStr === this.selectedDate;
        }
        case 'week': {
          const dayOfWeek = baseLocal.getDay(); // 0 is Sunday, 1 is Monday...
          const diffToMonday = baseLocal.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          const monday = new Date(baseLocal.getFullYear(), baseLocal.getMonth(), diffToMonday);
          monday.setHours(0, 0, 0, 0);
          
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          sunday.setHours(23, 59, 59, 999);
          
          return rLocal >= monday && rLocal <= sunday;
        }
        case 'month': {
          return rYear === baseLocal.getFullYear() && rMonth === baseLocal.getMonth();
        }
        case 'year': {
          return rYear === baseLocal.getFullYear();
        }
        case 'all': {
          return true;
        }
        default: {
          const rDateStr = typeof r.flightDate === 'string' 
            ? r.flightDate.split('T')[0] 
            : rDate.toISOString().split('T')[0];
          return rDateStr === this.selectedDate;
        }
      }
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

  get analytics() {
    const list = this.filteredListReservations;
    const totalBookings = list.length;
    const totalPassengers = list.reduce((sum, r) => sum + (r.details?.length || 0), 0);
    
    // Financials by currency
    const financials: { [key: string]: { total: number, paid: number, due: number } } = {
      'USD': { total: 0, paid: 0, due: 0 },
      'EUR': { total: 0, paid: 0, due: 0 },
      'TRY': { total: 0, paid: 0, due: 0 },
      'GBP': { total: 0, paid: 0, due: 0 }
    };
    
    // Booking source counts
    const sources: { [key: string]: number } = {};
    
    // Status counts
    const statusCounts = { pending: 0, confirmed: 0, cancelled: 0 };
    
    list.forEach(r => {
      const cur = this.getCurrencyCode(r.preferredCurrency);
      if (!financials[cur]) {
        financials[cur] = { total: 0, paid: 0, due: 0 };
      }
      const total = r.totalAmount || 0;
      const paid = this.getAmountPaidForRes(r);
      const due = this.getRemainingBalance(r);
      
      financials[cur].total += total;
      financials[cur].paid += paid;
      financials[cur].due += due;
      
      // Source
      const src = r.bookingSource || 'Unknown';
      sources[src] = (sources[src] || 0) + (r.details?.length || 0);
      
      // Status
      if (r.status === 0) statusCounts.pending++;
      else if (r.status === 1) statusCounts.confirmed++;
      else if (r.status === 2) statusCounts.cancelled++;
    });
    
    return {
      totalBookings,
      totalPassengers,
      financials: Object.keys(financials).map(k => ({
        currency: k,
        total: financials[k].total,
        paid: financials[k].paid,
        due: financials[k].due
      })).filter(f => f.total > 0 || f.paid > 0 || f.due > 0),
      sources: Object.keys(sources).map(k => ({ name: k, count: sources[k] })),
      statusCounts
    };
  }

  formatSourceLabel(source: string): string {
    if (!source || source.toLowerCase() === 'unknown') return 'Direct / Unknown';
    switch (source.toLowerCase()) {
      case 'whatsapp': return 'WhatsApp';
      case 'instagram': return 'Instagram';
      case 'office': return 'Office';
      case 'agency': return 'Agency';
      case 'rednote wechat': return 'Rednote WeChat';
      case 'website': return 'Website';
      case 'guest': return 'Guest';
      default: return source.charAt(0).toUpperCase() + source.slice(1);
    }
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
    return Number((paid + Number(deposit)).toFixed(2)) >= totalDue && totalDue > 0;
  }

  getRemainingBalance(res: Reservation): number {
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
    const balance = totalDue - (paid + Number(deposit));
    return Math.max(0, Number(balance.toFixed(2)));
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
    return Number((paid + Number(deposit)).toFixed(2));
  }

  exportToExcel(): void {
    const dataToExport: any[] = [];
    const reservationsToExport = this.filteredListReservations;

    const getFlightTimeLabel = (id?: number) => {
      return this.flightTimes.find(ft => ft.id === id)?.time || '';
    };

    const getStatusLabel = (res: Reservation) => {
      if (res.status === 2 && this.hasRefund(res)) return 'Refunded';
      switch (res.status) {
        case 0: return 'Pending';
        case 1: return 'Confirmed';
        case 2: return 'Cancelled';
        default: return 'Unknown';
      }
    };

    const getAgencyName = (res: Reservation) => {
      if (!res.isAgencyBooking) return 'N/A';
      return this.agencies.find(a => a.id === res.agencyId)?.name || res.agencyName || 'Agency';
    };

    reservationsToExport.forEach(r => {
      const remainingBalance = this.getRemainingBalance(r);
      const paidAmount = this.getAmountPaidForRes(r);
      const statusLabel = getStatusLabel(r);
      const timeLabel = getFlightTimeLabel(r.flightTimeId);
      const currencyLabel = this.getCurrencyCode(r.preferredCurrency);
      const agencyName = getAgencyName(r);

      if (r.details && r.details.length > 0) {
        r.details.forEach((d, index) => {
          const customerName = d.customer ? d.customer.fullName || '' : `Passenger ${index + 1}`;
          const customerPhone = d.customer?.phoneNumber || '';
          const pilotName = this.pilots.find(p => p.id === d.pilotId)?.fullName || '';
          const packageName = this.flightPackages.find(p => p.id === d.flightPackageId)?.title || '';
          const transportGroupName = this.transportGroups.find(tg => tg.id === d.transportGroupId)
            ? `Plate: ${this.transportGroups.find(tg => tg.id === d.transportGroupId)?.vehiclePlate || ''} (${this.transportGroups.find(tg => tg.id === d.transportGroupId)?.driverName || ''})`
            : '';
          
          const extrasList = d.extraServiceIds && d.extraServiceIds.length > 0
            ? d.extraServiceIds.map(eid => this.extraServices.find(es => es.id === eid)?.name || '').filter(Boolean).join(', ')
            : '';

          dataToExport.push({
            'Res ID': r.id,
            'Flight Date': typeof r.flightDate === 'string' ? r.flightDate.split('T')[0] : new Date(r.flightDate).toISOString().split('T')[0],
            'Flight Time': timeLabel,
            'Reservation Name': r.title || '',
            'Status': statusLabel,
            'Agency Booking': r.isAgencyBooking ? 'Yes' : 'No',
            'Agency Name': agencyName,
            'Total Amount': r.totalAmount || 0,
            'Paid Amount': paidAmount,
            'Remaining Balance': remainingBalance,
            'Currency': currencyLabel,
            'Passenger No': index + 1,
            'Passenger Name': customerName,
            'Passenger Phone': customerPhone,
            'Weight Limit Exceeded': d.weightLimitStatus ? 'Yes' : 'No',
            'Pilot': pilotName,
            'Flight Package': packageName,
            'Transport Details': transportGroupName,
            'Extra Services': extrasList,
            'Passenger Notes': d.pilotNote || '',
            'Reservation Notes': r.notes || ''
          });
        });
      } else {
        dataToExport.push({
          'Res ID': r.id,
          'Flight Date': typeof r.flightDate === 'string' ? r.flightDate.split('T')[0] : new Date(r.flightDate).toISOString().split('T')[0],
          'Flight Time': timeLabel,
          'Reservation Name': r.title || '',
          'Status': statusLabel,
          'Agency Booking': r.isAgencyBooking ? 'Yes' : 'No',
          'Agency Name': agencyName,
          'Total Amount': r.totalAmount || 0,
          'Paid Amount': paidAmount,
          'Remaining Balance': remainingBalance,
          'Currency': currencyLabel,
          'Passenger No': '',
          'Passenger Name': '',
          'Passenger Phone': '',
          'Weight Limit Exceeded': '',
          'Pilot': '',
          'Flight Package': '',
          'Transport Details': '',
          'Extra Services': '',
          'Passenger Notes': '',
          'Reservation Notes': r.notes || ''
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations');
    
    // Auto-fit columns
    const max_width = dataToExport.reduce((w, r) => {
      Object.keys(r).forEach((key, col_idx) => {
        const val = String(r[key] || '');
        w[col_idx] = Math.max(w[col_idx] || 0, val.length, key.length);
      });
      return w;
    }, []);
    worksheet['!cols'] = max_width.map((w: any) => ({ wch: w + 2 }));

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `Reservations_${this.selectedDate}.xlsx`;
    
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();
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

  editReservation(res: Reservation): void {
    this.router.navigate(['/reservations/edit', res.id]);
  }

  openPayment(res: Reservation): void {
    if (this.isFullyPaid(res)) return;
    this.router.navigate(['/payments'], { queryParams: { id: res.id } });
  }

  printReservation(r: Reservation): void {
    this.reservationService.getReservation(r.id!).subscribe(fullRes => {
      this.showPrintModal(fullRes);
    });
  }

  showPrintModal(res: Reservation): void {
    const modalHtml = `
      <div id="printModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: 'Segoe UI', sans-serif;">
        <div style="background: white; padding: 24px; border-radius: 20px; width: 400px; max-width: calc(100% - 32px); margin: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center;">
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
    const prefCurrency = (fullRes.preferredCurrency !== undefined && fullRes.preferredCurrency !== null)
      ? Number(fullRes.preferredCurrency)
      : PaymentCurrency.USD;
    
    // Calculate total paid with currency conversion
    const paidFromPayments = this.payments
      .filter(p => p.reservationId === fullRes.id)
      .reduce((sum, p) => {
        const fromCode = this.getCurrencyCode(p.currency);
        const toCode = this.getCurrencyCode(prefCurrency);
        const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
        return sum + converted;
      }, 0);

    const totalPaid = Number((paidFromPayments + Number(deposit)).toFixed(2));
    const restToPay = Math.max(0, Number((totalAmount - totalPaid).toFixed(2)));

    // Get payment details from the first payment record, or fallback to reservation preference
    const firstPayment = this.payments.find(p => p.reservationId === fullRes.id);
    const payMethod = firstPayment ? (firstPayment.method === 1 ? 'CARD' : (firstPayment.method === 2 ? 'TRANSFER' : 'CASH')) : (fullRes.depositMethod === 1 ? 'CARD' : (fullRes.depositMethod === 2 ? 'TRANSFER' : 'CASH'));
    const payCurrency = this.getCurrencyLabel(prefCurrency);

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
                <div><h1>Flight Voucher</h1><div style="font-size: 10px;">#${fullRes.id} | ${new Date().toLocaleDateString('en-GB')}</div></div>
                <div style="text-align: right"><strong>${fullRes.title || 'Paragliding'}</strong><div>Status: ${statusLabel}</div></div>
              </div>
              <div class="content">
                <div><div class="section-title">Flight Details</div><div class="info-grid">
                  <div class="info-item"><strong>Date</strong>${new Date(fullRes.flightDate).toLocaleDateString('en-GB')}</div>
                  <div class="info-item"><strong>Time</strong>${flightTimeLabel}</div>
                  <div class="info-item"><strong>Pickup</strong>${fullRes.pickupLocation || 'No Pickup'}</div>
                  <div class="info-item"><strong>Booking</strong>${fullRes.isAgencyBooking ? 'Agency: ' + (fullRes.agencyName || 'N/A') : 'Direct'}</div>
                  ${fullRes.isAgencyBooking && fullRes.billetNumber ? `<div class="info-item"><strong>Billet No</strong>${fullRes.billetNumber}</div>` : ''}
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
            <div class="row"><span>DATE:</span><span>${new Date(fullRes.flightDate).toLocaleDateString('en-GB')}</span></div>
            <div class="row"><span>TIME:</span><span>${flightTimeLabel}</span></div>
            <div class="row"><span>PICKUP:</span><span>${fullRes.pickupLocation || 'None'}</span></div>
            ${fullRes.isAgencyBooking ? `<div class="row"><span>AGENCY:</span><span>${fullRes.agencyName || 'Agency'}</span></div>` : ''}
            ${fullRes.isAgencyBooking && fullRes.billetNumber ? `<div class="row"><span>BILLET NO:</span><span>${fullRes.billetNumber}</span></div>` : ''}
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
      this.isLoading = true;
      this.reservationService.updateReservation(reservation.id!, reservation).subscribe({
        next: () => {
          this.isLoading = false;
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
          this.isLoading = false;
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

  printSlotPdf(group: any): void {
    const activeReservations = group.reservations.filter((r: any) => r.status !== ReservationStatus.Cancelled);

    if (activeReservations.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Active Flights',
        text: 'There are no active (non-cancelled) reservations in this slot to print.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      Swal.fire({
        icon: 'error',
        title: 'Pop-up Blocked',
        text: 'Please allow pop-ups for this website to open the print manifest.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const formattedDate = (() => {
      try {
        const parts = this.selectedDate.split('-');
        if (parts.length === 3) {
          const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          return dateObj.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
      } catch (e) {
        console.error(e);
      }
      return this.selectedDate;
    })();

    let totalPassengers = 0;
    const rowsHtml: string[] = [];

    activeReservations.forEach((r: any) => {
      const remainingBalance = this.getRemainingBalance(r);
      const totalAmount = r.isAgencyBooking ? (r.agencyPrice || 0) : (r.totalAmount || 0);
      const paidAmount = this.getAmountPaidForRes(r);
      const currencyLabel = this.getCurrencyLabel(r.preferredCurrency !== undefined && r.preferredCurrency !== null ? Number(r.preferredCurrency) : PaymentCurrency.USD);
      
      const agencyName = r.isAgencyBooking
        ? (this.agencies.find(a => a.id === r.agencyId)?.name || r.agencyName || 'Agency')
        : '';

      const details = r.details || [];
      totalPassengers += details.length;

      if (details.length === 0) {
        rowsHtml.push(`
          <tr class="page-break">
            <td class="text-center font-bold">#${r.id}</td>
            <td class="font-bold">${r.title || 'Untitled'}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td class="payment-cell">
              <div class="font-bold text-dark">${totalAmount.toFixed(2)} ${currencyLabel}</div>
              <div class="x-small text-muted">Paid: ${paidAmount.toFixed(2)}</div>
              <div class="x-small text-danger">Due: ${remainingBalance.toFixed(2)}</div>
            </td>
            <td class="notes-cell">${r.notes || ''}</td>
          </tr>
        `);
      } else {
        details.forEach((d: any, index: number) => {
          const customer = d.customer || this.customers.find((c: any) => c.id === d.customerId);
          const passengerName = customer ? customer.fullName : `Passenger ${index + 1}`;
          const passengerPhone = customer ? customer.phoneNumber : 'N/A';
          const passengerCountry = customer ? customer.country || 'N/A' : 'N/A';

          const pilot = this.pilots.find((p: any) => p.id === d.pilotId);
          const pilotName = pilot ? pilot.fullName : '<span class="text-muted font-italic">Pending</span>';

          const pkg = this.flightPackages.find((fp: any) => fp.id === d.flightPackageId);
          const packageName = pkg ? pkg.title : 'Standard';

          const extras = d.extraServiceIds && d.extraServiceIds.length > 0
            ? d.extraServiceIds.map((eid: number) => this.extraServices.find((es: any) => es.id === eid)?.name || '').filter(Boolean).join(', ')
            : '';

          const transport = this.transportGroups.find((tg: any) => tg.id === d.transportGroupId);
          const transportInfo = transport
            ? `<div class="font-bold">${transport.driverName || 'Driver'}</div><div class="x-small text-muted">${transport.vehiclePlate || ''}</div>`
            : (r.pickupLocation ? `<div class="x-small font-bold text-wrap">${r.pickupLocation}</div>` : '<span class="text-muted font-italic">None</span>');

          let paymentCellHtml = '';
          if (index === 0) {
            const rowSpanAttr = details.length > 1 ? ` rowspan="${details.length}"` : '';
            const paymentStatusText = remainingBalance <= 0 
              ? `<span class="badge badge-success">PAID</span>` 
              : `<span class="badge badge-danger">DUE: ${remainingBalance.toFixed(2)} ${currencyLabel}</span>`;
            
            const billetTag = r.isAgencyBooking && r.billetNumber
              ? `<div class="x-small text-muted" style="margin-top: 2px; font-size: 7.5pt;">Billet: ${r.billetNumber}</div>`
              : '';

            const agencyTag = agencyName 
              ? `<div class="text-purple-tag font-bold"><i class="bi bi-building"></i> ${agencyName}</div>${billetTag}`
              : `<div class="x-small text-muted">Direct</div>`;

            paymentCellHtml = `
              <td${rowSpanAttr} class="payment-cell">
                <div class="font-bold text-dark">${totalAmount.toFixed(2)} ${currencyLabel}</div>
                <div class="x-small text-muted">Paid: ${paidAmount.toFixed(2)} ${currencyLabel}</div>
                <div style="margin-top: 4px;">${paymentStatusText}</div>
                ${agencyTag}
              </td>
            `;
          }

          const weightWarning = d.weightLimitStatus 
            ? `<span class="badge badge-warning" style="margin-left: 5px;">Weight!</span>` 
            : '';

          const notesParts: string[] = [];
          if (r.notes && index === 0) {
            notesParts.push(`<strong>Booking:</strong> ${r.notes}`);
          }
          if (d.pilotNote) {
            notesParts.push(`<strong>Pilot:</strong> ${d.pilotNote}`);
          }
          const notesText = notesParts.join('<br>');

          rowsHtml.push(`
            <tr class="page-break">
              <td class="text-center font-bold">
                #${r.id}
                ${index > 0 ? `<div class="x-small text-muted">(P${index + 1})</div>` : ''}
              </td>
              <td>
                <div class="font-bold text-dark">${passengerName}</div>
                <div class="x-small text-muted">${passengerPhone} | ${passengerCountry} ${weightWarning}</div>
              </td>
              <td>${pilotName}</td>
              <td>
                <div class="font-bold">${packageName}</div>
                ${extras ? `<div class="text-info-tag">${extras}</div>` : ''}
              </td>
              <td>${transportInfo}</td>
              ${paymentCellHtml}
              <td class="notes-cell">${notesText}</td>
            </tr>
          `);
        });
      }
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Flight Manifest - Slot ${group.flightTime.time}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 8.5pt;
              line-height: 1.3;
            }
            
            .manifest-container {
              width: 100%;
              max-width: 210mm;
              margin: 0 auto;
              padding-bottom: 60px;
            }
            
            .manifest-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            
            .brand-title {
              font-size: 16pt;
              font-weight: 800;
              letter-spacing: -0.5px;
              color: #0f172a;
              margin: 0;
              text-transform: uppercase;
              display: flex;
              align-items: center;
            }
            
            .brand-title span {
              color: #2563eb;
              margin-left: 4px;
            }
            
            .manifest-subtitle {
              font-size: 9.5pt;
              color: #64748b;
              font-weight: 500;
              margin: 2px 0 0 0;
            }
            
            .manifest-meta {
              text-align: right;
            }
            
            .meta-label {
              font-size: 7.5pt;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #64748b;
              font-weight: 600;
            }
            
            .meta-value {
              font-size: 9.5pt;
              color: #0f172a;
              font-weight: 700;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            }
            
            th {
              background-color: #f8fafc;
              color: #475569;
              font-weight: 600;
              font-size: 8pt;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              padding: 8px 6px;
              text-align: left;
              border-bottom: 2px solid #cbd5e1;
              border-top: 1px solid #e2e8f0;
            }
            
            td {
              padding: 8px 6px;
              font-size: 8pt;
              border-bottom: 1px solid #e2e8f0;
              color: #334155;
              vertical-align: top;
            }
            
            tr:nth-child(even) td {
              background-color: #f8fafc;
            }
            
            .text-center {
              text-align: center;
            }
            
            .font-bold {
              font-weight: 600;
            }
            
            .text-primary {
              color: #2563eb;
            }
            
            .text-muted {
              color: #64748b;
            }
            
            .font-italic {
              font-style: italic;
            }
            
            .badge {
              display: inline-block;
              padding: 2px 4px;
              border-radius: 4px;
              font-size: 7pt;
              font-weight: 700;
              text-align: center;
              letter-spacing: 0.2px;
            }
            
            .badge-success {
              background-color: #dcfce7;
              color: #15803d;
            }
            
            .badge-danger {
              background-color: #fee2e2;
              color: #b91c1c;
            }
            
            .badge-warning {
              background-color: #fef9c3;
              color: #a16207;
            }
            
            .text-purple-tag {
              color: #7c3aed;
              background-color: #f3e8ff;
              padding: 1px 4px;
              border-radius: 4px;
              display: inline-block;
              margin-top: 4px;
              font-size: 7pt;
            }
            
            .text-info-tag {
              color: #0891b2;
              background-color: #ecfeff;
              padding: 1px 3px;
              border-radius: 3px;
              display: inline-block;
              margin-top: 2px;
              font-size: 7pt;
            }
            
            .notes-cell {
              font-size: 7.5pt;
              max-width: 120px;
              word-wrap: break-word;
            }
            
            .footer-summary {
              position: fixed;
              bottom: 10mm;
              left: 10mm;
              right: 10mm;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 12px;
              border-top: 2px solid #e2e8f0;
              padding-top: 12px;
              background-color: #ffffff;
            }
            
            .summary-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 8px 12px;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            
            .summary-title {
              font-size: 7.5pt;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 2px;
            }
            
            .summary-val {
              font-size: 11pt;
              font-weight: 700;
              color: #0f172a;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              thead {
                display: table-header-group;
              }
              
              tr {
                page-break-inside: avoid;
              }
              
              .page-break {
                page-break-inside: avoid;
              }
              
              .footer-summary {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                border-top: 2px solid #cbd5e1;
                background: #ffffff !important;
                padding-top: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="manifest-container">
            <div class="manifest-header">
              <div>
                <h1 class="brand-title">GRAVITY<span>PARAGLIDING</span></h1>
                <p class="manifest-subtitle">Flight Time Slot Manifest & Passenger Manifest</p>
              </div>
              <div class="manifest-meta">
                <div class="meta-label">Generated On</div>
                <div class="meta-value">${new Date().toLocaleString()}</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 8%;" class="text-center">Res ID</th>
                  <th style="width: 22%;">Passenger & Contact</th>
                  <th style="width: 14%;">Assigned Pilot</th>
                  <th style="width: 18%;">Package & Extras</th>
                  <th style="width: 14%;">Transport (Pickup)</th>
                  <th style="width: 12%;">Payments</th>
                  <th style="width: 12%;">Notes</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml.join('')}
              </tbody>
            </table>
            
            <div class="footer-summary">
              <div class="summary-card">
                <div class="summary-title">Flight Date</div>
                <div class="summary-val">${formattedDate}</div>
              </div>
              <div class="summary-card">
                <div class="summary-title">Total Active Passengers</div>
                <div class="summary-val">${totalPassengers}</div>
              </div>
              <div class="summary-card">
                <div class="summary-title">Flight Slot Time</div>
                <div class="summary-val">${group.flightTime.time}</div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  deleteReservation(id: number): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.isLoading = true;
      this.reservationService.deleteReservation(id).subscribe({
        next: () => this.loadReservations(),
        error: (err) => {
          console.error('Error deleting reservation', err);
          this.isLoading = false;
        }
      });
    }
  }
}
