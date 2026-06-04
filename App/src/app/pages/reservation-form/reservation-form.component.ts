import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';
import {
  Reservation, ReservationStatus, Customer, Pilot, PilotGroup, Agency,
  FlightPackage, TransportGroup, ExtraService, Country, FlightTime, PickupStatus, Payment, PaymentCurrency, PaymentMethod
} from '../../models/models';
import { PaymentService } from '../../services/payment.service';
import { ReservationService } from '../../services/reservation.service';
import { CustomerService } from '../../services/customer.service';
import { PilotService } from '../../services/pilot.service';
import { PilotGroupService } from '../../services/pilot-group.service';
import { AgencyService } from '../../services/agency.service';
import { FlightPackageService } from '../../services/flight-package.service';
import { TransportGroupService } from '../../services/transport-group.service';
import { ExtraServiceService } from '../../services/extra-service.service';
import { FlightTimeService } from '../../services/flight-time.service';
import { CurrencyService } from '../../services/currency.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation-form',
  standalone: false,
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {
  isEditing = false;
  reservationId: number | null = null;
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  mapInitialized = false;
  isLoading = false;
  private searchTimeout: any;
  locationSuggestions: any[] = [];

  ReservationStatus = ReservationStatus;
  PickupStatus = PickupStatus;
  
  statusOptions = [
    { value: ReservationStatus.Pending, label: 'Pending' },
    { value: ReservationStatus.Confirmed, label: 'Confirmed' },
    { value: ReservationStatus.Cancelled, label: 'Cancelled' }
  ];

  pickupStatusOptions = [
    { value: PickupStatus.NotRequired, label: 'Not Required' },
    { value: PickupStatus.Pending, label: 'Pending (To Be Picked Up)' },
    { value: PickupStatus.PickedUp, label: 'Picked Up' },
    { value: PickupStatus.NoShow, label: 'No Show' }
  ];

  currencyOptions = [
    { value: PaymentCurrency.USD, label: 'USD ($)' },
    { value: PaymentCurrency.EUR, label: 'EUR (€)' },
    { value: PaymentCurrency.TL, label: 'TRY (₺)' },
    { value: PaymentCurrency.GBP, label: 'GBP (£)' }
  ];

  methodOptions = [
    { value: PaymentMethod.Cash, label: 'Cash' },
    { value: PaymentMethod.Card, label: 'Card' },
    { value: PaymentMethod.Transfer, label: 'Transfer/IBAN' }
  ];

  bookingSourceOptions = [
    { value: 'office', label: 'Office' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'agency', label: 'Agency' },
    { value: 'rednote wechat', label: 'Rednote WeChat' },
    { value: 'website', label: 'Website' },
    { value: 'guest', label: 'Guest' }
  ];

  paxOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  reservation: Reservation = {
    flightDate: '',
    flightTimeId: 1, // Default to first slot
    status: ReservationStatus.Pending,
    pickupStatus: PickupStatus.NotRequired,
    pickupLocation: '',
    isAgencyBooking: false,
    preferredCurrency: PaymentCurrency.USD,
    depositMethod: PaymentMethod.Cash,
    depositCurrency: PaymentCurrency.USD,
    billetNumber: '',
    bookingSource: '',
    details: [
      {
        customerId: 0,
        pilotId: 0,
        flightPackageId: 0,
        transportGroupId: undefined,
        weightLimitStatus: false,
        extraServiceIds: [],
        customer: this.createEmptyCustomer()
      }
    ],
    photos: []
  };

  customers: Customer[] = [];
  pilots: Pilot[] = [];
  flightPackages: FlightPackage[] = [];
  transportGroups: TransportGroup[] = [];
  extraServices: ExtraService[] = [];
  countries: Country[] = [];
  flightTimes: FlightTime[] = [];
  pilotGroups: PilotGroup[] = [];
  agencies: Agency[] = [];
  payments: Payment[] = [];
  totalPaid = 0;
  remainingBalance = 0;

  // Temporary property for filtering in the form
  selectedGroupIds: { [key: number]: number } = {};
  filteredPilots: { [key: number]: Pilot[] } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private pilotService: PilotService,
    private pilotGroupService: PilotGroupService,
    private agencyService: AgencyService,
    private flightPackageService: FlightPackageService,
    private transportGroupService: TransportGroupService,
    private extraServiceService: ExtraServiceService,
    private flightTimeService: FlightTimeService,
    private paymentService: PaymentService,
    private currencyService: CurrencyService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    const lookups = {
      customers: this.customerService.getCustomers(),
      pilots: this.pilotService.getPilots(),
      pilotGroups: this.pilotGroupService.getPilotGroups(),
      packages: this.flightPackageService.getFlightPackages(),
      transports: this.transportGroupService.getTransportGroups(),
      extras: this.extraServiceService.getExtraServices(),
      flightTimes: this.flightTimeService.getFlightTimes(),
      agencies: this.agencyService.getAgencies(),
      countries: this.http.get<Country[]>('/assets/js/Countries/countries.json')
    };

    forkJoin(lookups).subscribe({
      next: (res) => {
        this.customers = res.customers;
        this.pilots = res.pilots;
        this.pilotGroups = res.pilotGroups;
        this.flightPackages = res.packages;
        this.transportGroups = res.transports;
        this.extraServices = res.extras;
        this.flightTimes = res.flightTimes;
        this.agencies = res.agencies;
        this.countries = res.countries;

        this.mapAndSortPilots();

        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.isEditing = true;
            this.reservationId = +id;
            this.loadReservation(this.reservationId);
          } else {
            this.reservation.details.forEach((_, i) => this.updateFilteredPilots(i));
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading lookups', err);
        this.isLoading = false;
      }
    });
  }

  createEmptyCustomer(): Customer {
    return {
      fullName: '',
      phoneNumber: '',
      dateOfBirth: '',
      email: '',
      country: undefined
    };
  }

  loadLookups(): void {
    // Keep as a fallback but actual load is via forkJoin in ngOnInit
  }

  mapAndSortPilots(): void {
    if (!this.pilots.length || !this.pilotGroups.length) return;
    
    this.pilots.forEach(p => {
      p.groupName = p.pilotGroupId ? (this.pilotGroups.find(g => g.id === p.pilotGroupId)?.name || 'No Group') : 'No Group';
    });

    this.pilots = [...this.pilots].sort((a, b) => {
      // 1. Group comparison
      const groupA = a.groupName || 'No Group';
      const groupB = b.groupName || 'No Group';
      if (groupA !== groupB) {
        if (groupA === 'No Group') return 1;
        if (groupB === 'No Group') return -1;
        return groupA.localeCompare(groupB);
      }
      // 2. Flights Assigned (Min to Max)
      const assignedA = a.flightsAssigned || 0;
      const assignedB = b.flightsAssigned || 0;
      if (assignedA !== assignedB) {
        return assignedA - assignedB;
      }
      // 3. Flights Flown (Min to Max)
      const flownA = a.flightsFlown || 0;
      const flownB = b.flightsFlown || 0;
      return flownA - flownB;
    });
  }

  updateFilteredPilots(index: number): void {
    const groupId = this.selectedGroupIds[index];
    if (!groupId) {
      this.filteredPilots[index] = [...this.pilots];
    } else {
      this.filteredPilots[index] = this.pilots.filter(p => p.pilotGroupId === Number(groupId));
    }
  }

  onPilotGroupChange(index: number): void {
    // Reset pilot selection when group changes
    this.reservation.details[index].pilotId = undefined;
    this.updateFilteredPilots(index);
  }

  loadReservation(id: number): void {
    this.reservationService.getReservation(id).subscribe(data => {
      this.reservation = data;
      this.reservation.photos = this.reservation.photos || [];
      if (this.reservation.flightDate) {
        // Parse the date and extract YYYY-MM-DD in local time to avoid timezone shifts
        const dateObj = new Date(this.reservation.flightDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        this.reservation.flightDate = `${year}-${month}-${day}`;
      }
      
      if (this.reservation.preferredCurrency === undefined || this.reservation.preferredCurrency === null) {
        this.reservation.preferredCurrency = PaymentCurrency.USD;
      }

      this.reservation.depositCurrency = this.reservation.preferredCurrency;

      if (!this.reservation.details || this.reservation.details.length === 0) {
        this.reservation.details = [this.createEmptyDetail()];
      } else {
        this.reservation.details.forEach((d, i) => {
          if (!d.customer) d.customer = this.createEmptyCustomer();
          if (d.customer.dateOfBirth) {
            d.customer.dateOfBirth = new Date(d.customer.dateOfBirth).toISOString().split('T')[0];
          }
          // Initialize selected group if pilot exists
          if (d.pilotId) {
            const pilot = this.pilots.find(p => p.id === d.pilotId);
            if (pilot && pilot.pilotGroupId) {
              this.selectedGroupIds[i] = pilot.pilotGroupId;
            }
          }
          this.updateFilteredPilots(i);
        });
      }
      if (this.reservation.pickupStatus !== PickupStatus.NotRequired) {
        setTimeout(() => {
          this.initMap();
          if (this.reservation.pickupLocation) {
            this.searchLocation();
          }
        }, 500);
      }
      this.loadPayments(id);
    });
  }

  loadPayments(reservationId: number): void {
    this.paymentService.getPayments().subscribe(data => {
      this.payments = data.filter(p => p.reservationId === reservationId);
      this.calculateBalances();
      this.isLoading = false;
    });
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

  calculateBalances(): void {
    const paxCount = this.reservation.details.length || 1;
    if (this.reservation.isAgencyBooking) {
      if (this.reservation.agencyPrice !== undefined && this.reservation.agencyPrice !== null) {
        this.reservation.totalAmount = this.reservation.agencyPrice * paxCount;
      } else {
        this.reservation.agencyPrice = (this.reservation.totalAmount || 0) / paxCount;
      }
    } else if (this.isEditing && this.reservation.totalAmount !== undefined && this.reservation.totalAmount > 0) {
      // If editing and we already have a saved total amount, don't overwrite it automatically
      // unless specifically triggered by a package change (which happens in the HTML event)
    } else {
      // Re-calculate total amount from package prices if not agency booking
      let total = 0;
      this.reservation.details.forEach(d => {
        const pkg = this.flightPackages.find(p => p.id === d.flightPackageId);
        if (pkg) total += pkg.price;
        
        // Add extra services
        if (d.extraServiceIds) {
          d.extraServiceIds.forEach(eid => {
            const extra = this.extraServices.find(e => e.id === eid);
            if (extra) total += extra.price;
          });
        }
      });
      this.reservation.totalAmount = total;
    }
    const totalDue = this.reservation.totalAmount || 0;
    const deposit = this.reservation.deposit || 0;
    const prefCurrency = (this.reservation.preferredCurrency !== undefined && this.reservation.preferredCurrency !== null)
      ? Number(this.reservation.preferredCurrency)
      : PaymentCurrency.USD;

    const rawPaid = this.payments.reduce((sum, p) => {
      const fromCode = this.getCurrencyCode(p.currency);
      const toCode = this.getCurrencyCode(prefCurrency);
      const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
      return sum + converted;
    }, 0) + Number(deposit);
    
    this.totalPaid = Number(rawPaid.toFixed(2));
    this.remainingBalance = Math.max(0, Number((totalDue - this.totalPaid).toFixed(2)));
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

  onAgencyPriceChange(): void {
    const paxCount = this.reservation.details.length || 1;
    if (this.reservation.isAgencyBooking) {
      if (this.reservation.agencyPrice === undefined || this.reservation.agencyPrice === null) {
        this.reservation.agencyPrice = (this.reservation.totalAmount || 0) / paxCount;
      }
    } else {
      this.reservation.agencyPrice = undefined;
    }
    this.calculateBalances();
  }

  onManualTotalChange(): void {
    const paxCount = this.reservation.details.length || 1;
    if (this.reservation.isAgencyBooking) {
      this.reservation.agencyPrice = (this.reservation.totalAmount || 0) / paxCount;
    }
    const totalDue = this.reservation.totalAmount || 0;
    const deposit = this.reservation.deposit || 0;
    const prefCurrency = (this.reservation.preferredCurrency !== undefined && this.reservation.preferredCurrency !== null)
      ? Number(this.reservation.preferredCurrency)
      : PaymentCurrency.USD;
    
    const rawPaid = this.payments.reduce((sum, p) => {
      const fromCode = this.getCurrencyCode(p.currency);
      const toCode = this.getCurrencyCode(prefCurrency);
      const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
      return sum + converted;
    }, 0) + Number(deposit);
    
    this.totalPaid = Number(rawPaid.toFixed(2));
    this.remainingBalance = Math.max(0, Number((totalDue - this.totalPaid).toFixed(2)));
  }

  isFullyPaid(): boolean {
    const totalDue = this.reservation.totalAmount || 0;
    return this.totalPaid >= totalDue && totalDue > 0;
  }

  isAnyPackageSelected(): boolean {
    return this.reservation.details && this.reservation.details.some(d => d.flightPackageId && d.flightPackageId > 0);
  }

  createEmptyDetail(): any {
    return {
      customerId: 0,
      pilotId: 0,
      flightPackageId: undefined,
      transportGroupId: undefined,
      weightLimitStatus: false,
      extraServiceIds: [],
      customer: this.createEmptyCustomer()
    };
  }

  onPaxChange(count: number): void {
    const currentCount = this.reservation.details.length;
    const targetCount = Number(count);
    
    if (targetCount > currentCount) {
      const firstDetail = this.reservation.details[0];
      for (let i = currentCount; i < targetCount; i++) {
        const newDetail = this.createEmptyDetail();
        if (firstDetail) {
          newDetail.flightPackageId = firstDetail.flightPackageId;
          newDetail.extraServiceIds = firstDetail.extraServiceIds ? [...firstDetail.extraServiceIds] : [];
        }
        this.reservation.details.push(newDetail);
        this.updateFilteredPilots(i);
      }
    } else if (targetCount < currentCount) {
      this.reservation.details.splice(targetCount);
    }
    
    this.calculateBalances();
  }

  addDetail(): void {
    this.reservation.details.push(this.createEmptyDetail());
    this.updateFilteredPilots(this.reservation.details.length - 1);
    this.calculateBalances();
  }

  removeDetail(index: number): void {
    if (this.reservation.details.length > 1) {
      this.reservation.details.splice(index, 1);
      this.calculateBalances();
    }
  }

  onCustomerSelect(index: number): void {
    const detail = this.reservation.details[index];
    const selectedCustomer = this.customers.find(c => c.id === detail.customerId);
    
    if (selectedCustomer) {
      // Clone the customer to avoid direct binding issues if we want to cancel edits (though user wants to edit)
      detail.customer = { ...selectedCustomer };
      if (detail.customer.dateOfBirth) {
        detail.customer.dateOfBirth = new Date(detail.customer.dateOfBirth).toISOString().split('T')[0];
      }
    } else {
      detail.customerId = 0;
      detail.customer = this.createEmptyCustomer();
    }
  }

  save(): void {
    this.reservation.status = Number(this.reservation.status);
    this.reservation.flightTimeId = Number(this.reservation.flightTimeId);
    this.reservation.preferredCurrency = (this.reservation.preferredCurrency !== undefined && this.reservation.preferredCurrency !== null)
      ? Number(this.reservation.preferredCurrency)
      : PaymentCurrency.USD;
    this.reservation.depositMethod = this.reservation.depositMethod !== undefined ? Number(this.reservation.depositMethod) : undefined;
    this.reservation.depositCurrency = this.reservation.preferredCurrency;
    this.reservation.totalAmount = Number(this.reservation.totalAmount || 0);
    
    if (this.reservation.isAgencyBooking) {
      this.reservation.agencyPrice = Number(this.reservation.agencyPrice || 0);
      this.reservation.totalAmount = this.reservation.agencyPrice * (this.reservation.details.length || 1);
    } else {
      this.reservation.agencyPrice = undefined;
      this.reservation.agencyId = undefined;
      this.reservation.billetNumber = undefined;
    }
    
    // Ensure all numeric values are properly casted
    this.reservation.details.forEach(detail => {
      detail.customerId = Number(detail.customerId);
      if (detail.pilotId) {
        detail.pilotId = Number(detail.pilotId);
      } else {
        detail.pilotId = undefined;
      }
      if (detail.flightPackageId) {
        detail.flightPackageId = Number(detail.flightPackageId);
      } else {
        detail.flightPackageId = undefined;
      }
      if (detail.transportGroupId) {
        detail.transportGroupId = Number(detail.transportGroupId);
      }
      if (detail.extraServiceIds) {
        detail.extraServiceIds = detail.extraServiceIds.map(id => Number(id));
      }
      if (detail.customer && detail.customer.country) {
        // detail.customer.country is already a string
      }
    });

    this.isLoading = true;
    if (this.isEditing) {
      this.reservationService.updateReservation(this.reservation.id!, this.reservation).subscribe({
        next: () => {
          this.router.navigate(['/reservations']);
        },
        error: (err) => {
          console.error('Error updating reservation', err);
          this.isLoading = false;
          Swal.fire('Error', 'Failed to update reservation', 'error');
        }
      });
    } else {
      this.reservationService.addReservation(this.reservation).subscribe({
        next: () => {
          this.router.navigate(['/reservations']);
        },
        error: (err) => {
          console.error('Error adding reservation', err);
          this.isLoading = false;
          Swal.fire('Error', 'Failed to add reservation', 'error');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/reservations']);
  }

  onPhotosSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Image = e.target.result;
          if (!this.reservation.photos) {
            this.reservation.photos = [];
          }
          this.reservation.photos.push({
            photoData: base64Image,
            fileName: file.name,
            contentType: file.type
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number): void {
    if (this.reservation.photos) {
      this.reservation.photos.splice(index, 1);
    }
  }

  viewPhoto(photo: any): void {
    Swal.fire({
      imageUrl: photo.photoData,
      imageAlt: photo.fileName || 'Reservation Photo',
      showCloseButton: true,
      showConfirmButton: false,
      width: 'auto',
      customClass: {
        image: 'img-fluid rounded shadow-sm'
      }
    });
  }

  printReservation(): void {
    this.showPrintModal(this.reservation);
  }

  showPrintModal(res: Reservation): void {
    const modalHtml = `
      <div id="formPrintModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: 'Segoe UI', sans-serif;">
        <div style="background: white; padding: 30px; border-radius: 20px; width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); text-align: center;">
          <h3 style="margin-bottom: 10px; color: #333;">Print Options</h3>
          <p style="color: #666; margin-bottom: 25px;">Choose your preferred document format</p>
          
          <div style="display: grid; gap: 15px;">
            <button id="formPrintA5" style="background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; border: none; padding: 15px; border-radius: 12px; cursor: pointer; font-weight: bold; transition: all 0.2s;">
              <i class="bi bi-file-earmark-text" style="margin-right: 8px;"></i> A5 Professional Voucher
            </button>
            <button id="formPrintThermal" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; border: none; padding: 15px; border-radius: 12px; cursor: pointer; font-weight: bold; transition: all 0.2s;">
              <i class="bi bi-printer" style="margin-right: 8px;"></i> Sewoo Thermal Receipt (80mm)
            </button>
            <button id="formClosePrintModal" style="background: #f8f9fa; color: #333; border: 1px solid #ddd; padding: 12px; border-radius: 12px; cursor: pointer; margin-top: 10px;">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper);

    document.getElementById('formPrintA5')?.addEventListener('click', () => {
      this.executePrint(res, 'A5');
      document.body.removeChild(wrapper);
    });

    document.getElementById('formPrintThermal')?.addEventListener('click', () => {
      this.executePrint(res, 'Thermal');
      document.body.removeChild(wrapper);
    });

    document.getElementById('formClosePrintModal')?.addEventListener('click', () => {
      document.body.removeChild(wrapper);
    });
  }

  executePrint(res: Reservation, mode: 'A5' | 'Thermal'): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const flightTimeLabel = this.flightTimes.find(f => f.id === res.flightTimeId)?.time || 'N/A';
    const statusLabel = this.statusOptions.find(o => o.value === res.status)?.label || 'Pending';
    const totalAmount = res.isAgencyBooking ? (res.agencyPrice || 0) : (res.totalAmount || 0);
    const deposit = res.deposit || 0;
    const prefCurrency = (res.preferredCurrency !== undefined && res.preferredCurrency !== null)
      ? Number(res.preferredCurrency)
      : PaymentCurrency.USD;
    
    // Calculate total paid with currency conversion
    const paidFromPayments = this.payments.reduce((sum, p) => {
      const fromCode = this.getCurrencyCode(p.currency);
      const toCode = this.getCurrencyCode(prefCurrency);
      const converted = this.currencyService.convert(Number(p.amount), fromCode, toCode);
      return sum + converted;
    }, 0);

    const totalPaid = Number((paidFromPayments + Number(deposit)).toFixed(2));
    const restToPay = Math.max(0, Number((totalAmount - totalPaid).toFixed(2)));
    
    const agencyName = res.isAgencyBooking ? (this.agencies.find(a => a.id === res.agencyId)?.name || 'Agency') : '';

    // Get payment details from the first payment record, or fallback to reservation preference
    const firstPayment = this.payments[0];
    const payMethod = firstPayment ? (firstPayment.method === 1 ? 'CARD' : (firstPayment.method === 2 ? 'TRANSFER' : 'CASH')) : (res.depositMethod === 1 ? 'CARD' : (res.depositMethod === 2 ? 'TRANSFER' : 'CASH'));
    const payCurrency = this.getCurrencyLabel(prefCurrency);

    if (mode === 'A5') {
      const passengersHtml = res.details.map((d, i) => `
        <div class="passenger-item">
          <div class="p-header">Passenger ${i + 1}: ${d.customer?.fullName || 'N/A'}</div>
          <div class="p-grid">
            <div><strong>Phone:</strong> ${d.customer?.phoneNumber || 'N/A'}</div>
            <div><strong>Country:</strong> ${d.customer?.country || 'N/A'}</div>
            <div><strong>Pilot:</strong> ${this.pilots.find(p => p.id === d.pilotId)?.fullName || 'Pending'}</div>
            <div><strong>Package:</strong> ${this.flightPackages.find(p => p.id === d.flightPackageId)?.title || 'N/A'}</div>
          </div>
        </div>
      `).join('');

      printWindow.document.write(`
        <html>
          <head>
            <title>Reservation #${res.id}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            <style>
              @page { size: A5 landscape; margin: 0; }
              body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; color: #333; background: #fff; font-size: 12px; }
              .ticket { border: 2px solid #0d6efd; border-radius: 15px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
              .header { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
              .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; }
              .content { padding: 15px; flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .section-title { border-bottom: 2px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; color: #0d6efd; text-transform: uppercase; font-size: 10px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 10px; }
              .info-item { margin-bottom: 3px; }
              .info-item strong { color: #666; font-size: 9px; display: block; }
              .passengers { grid-column: span 2; }
              .passenger-item { background: #f8f9fa; border-radius: 8px; padding: 8px; margin-bottom: 8px; border-left: 3px solid #0d6efd; }
              .p-header { font-weight: bold; margin-bottom: 5px; color: #333; border-bottom: 1px solid #dee2e6; padding-bottom: 3px; }
              .p-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 5px; font-size: 10px; }
              .footer { background: #f1f3f5; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #dee2e6; }
              .price-box { text-align: right; }
              .price-val { font-weight: bold; color: #0d6efd; font-size: 14px; }
              .price-label { color: #666; font-size: 10px; }
              .notes { grid-column: span 2; font-style: italic; color: #666; font-size: 10px; margin-top: 5px; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <div><h1>Flight Reservation</h1><div style="font-size: 10px; opacity: 0.8;">Voucher #${res.id} | ${new Date().toLocaleDateString('en-GB')}</div></div>
                <div style="text-align: right"><div style="font-weight: bold;">${res.title || 'Paragliding Experience'}</div><div style="font-size: 10px;">Status: ${statusLabel}</div></div>
              </div>
              <div class="content">
                <div class="flight-info">
                  <div class="section-title">Flight Details</div>
                  <div class="info-grid">
                    <div class="info-item"><strong>Date</strong>${res.flightDate}</div>
                    <div class="info-item"><strong>Time</strong>${flightTimeLabel}</div>
                    <div class="info-item"><strong>Pickup</strong>${res.pickupLocation || 'No Pickup'}</div>
                    <div class="info-item"><strong>Source</strong>${res.isAgencyBooking ? 'Agency: ' + agencyName : 'Direct'}</div>
                    ${res.isAgencyBooking && res.billetNumber ? `<div class="info-item"><strong>Billet No</strong>${res.billetNumber}</div>` : ''}
                    <div class="info-item"><strong>Created By</strong>${res.createdBy || 'System'}</div>
                  </div>
                </div>
                <div class="payment-info">
                  <div class="section-title">Payment Summary (${payCurrency})</div>
                  <div class="info-grid">
                    <div class="info-item"><strong>Total Amount</strong>${totalAmount.toFixed(2)} ${payCurrency}</div>
                    <div class="info-item"><strong>Paid Amount</strong>${totalPaid.toFixed(2)} ${payCurrency}</div>
                    <div class="info-item"><strong>Rest to Pay</strong>${restToPay.toFixed(2)} ${payCurrency}</div>
                    <div class="info-item" style="color: ${restToPay <= 0 ? 'green' : 'red'}; font-weight: bold;">
                      <strong>Method: ${payMethod}</strong>${restToPay <= 0 ? ' PAID' : ' DUE'}
                    </div>
                  </div>
                </div>
                <div class="passengers">
                  <div class="section-title">Passenger Details</div>
                  ${passengersHtml}
                </div>
                ${res.notes ? `<div class="notes"><strong>Notes:</strong> ${res.notes}</div>` : ''}
              </div>
              <div class="footer">
                <div style="font-size: 9px; color: #999;">Enjoy your flight! Contact: +90 5XX XXX XX XX</div>
                <div class="price-box"><div class="price-label">Rest to Pay</div><div class="price-val">${restToPay.toFixed(2)} ${payCurrency}</div></div>
              </div>
            </div>
            <script>window.onload = function() { window.print(); };</script>
          </body>
        </html>
      `);
    } else {
      // Thermal Sewoo Mode (80mm)
      const passengersList = res.details.map((d, i) => `
        <div style="border-bottom: 1px dashed #000; padding: 5px 0;">
          P${i+1}: ${d.customer?.fullName || 'N/A'}<br>
          <small>Pilot: ${this.pilots.find(p => p.id === d.pilotId)?.fullName || 'Pending'}</small>
        </div>
      `).join('');

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
            <div class="row"><span>DATE:</span><span>${res.flightDate}</span></div>
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
    }
    printWindow.document.close();
  }

  // --- Map and Geocoding Logic ---
  
  onPickupStatusChange() {
    if (this.reservation.pickupStatus !== PickupStatus.NotRequired) {
      if (!this.mapInitialized) {
        this.initMap();
      } else if (this.map) {
        setTimeout(() => {
          this.map!.invalidateSize();
        }, 100);
      }
    }
  }

  searchLocation() {
    if (!this.reservation.pickupLocation) return;
    
    // Nominatim geocoding restricted to Fethiye/Ölüdeniz area
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.reservation.pickupLocation)}&viewbox=28.9,36.75,29.3,36.4&bounded=1`;
    
    this.http.get<any[]>(url).subscribe(results => {
      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        this.updateMap(lat, lon);
      } else {
        // Fallback: search without bounded box but prioritize Turkey
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.reservation.pickupLocation + ', Fethiye')}&countrycodes=tr`;
        this.http.get<any[]>(fallbackUrl).subscribe(fbResults => {
          if (fbResults && fbResults.length > 0) {
             const lat = parseFloat(fbResults[0].lat);
             const lon = parseFloat(fbResults[0].lon);
             this.updateMap(lat, lon);
          }
        });
      }
    });
  }

  initMap() {
    if (this.mapInitialized) return;
    setTimeout(() => {
        const mapContainer = document.getElementById('pickupMap');
        if (!mapContainer || this.mapInitialized) return;

        this.map = L.map('pickupMap').setView([36.585, 29.115], 11); // Fethiye/Oludeniz center

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        const iconDefault = L.icon({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;
        this.mapInitialized = true;
    }, 200);
  }

  updateMap(lat: number, lng: number) {
    if (!this.map) this.initMap();
    if (this.map) {
        this.map.setView([lat, lng], 15);
        if (this.marker) {
            this.marker.setLatLng([lat, lng]);
        } else {
            this.marker = L.marker([lat, lng]).addTo(this.map);
        }
    }
  }

  onPickupLocationInput(event: any): void {
    const val = event.target.value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (!val || val.length < 3) {
      this.locationSuggestions = [];
      return;
    }

    this.searchTimeout = setTimeout(() => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&viewbox=28.9,36.75,29.3,36.4&bounded=1&limit=5`;
      this.http.get<any[]>(url).subscribe({
        next: (results) => {
          this.locationSuggestions = results || [];
        },
        error: (err) => {
          console.error('Error fetching suggestions', err);
        }
      });
    }, 400);
  }

  selectSuggestion(sug: any): void {
    this.reservation.pickupLocation = sug.display_name;
    this.locationSuggestions = [];
    const lat = parseFloat(sug.lat);
    const lon = parseFloat(sug.lon);
    this.updateMap(lat, lon);
  }

  onPickupLocationBlur(): void {
    setTimeout(() => {
      this.locationSuggestions = [];
    }, 200);
  }
}
