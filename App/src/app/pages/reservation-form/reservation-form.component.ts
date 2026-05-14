import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {
  Reservation, ReservationStatus, Customer, Pilot, PilotGroup, Agency,
  FlightPackage, TransportGroup, ExtraService, Country, FlightTime, PickupStatus, Payment
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

  reservation: Reservation = {
    flightDate: '',
    flightTimeId: 1, // Default to first slot
    status: ReservationStatus.Pending,
    pickupStatus: PickupStatus.NotRequired,
    pickupLocation: '',
    isAgencyBooking: false,
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
    ]
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
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadLookups();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.reservationId = +id;
        this.loadReservation(this.reservationId);
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
    this.customerService.getCustomers().subscribe(data => this.customers = data);
    this.pilotService.getPilots().subscribe(data => {
      this.pilots = data;
      // Initialize filtered pilots for all existing details
      this.reservation.details.forEach((_, i) => this.updateFilteredPilots(i));
    });
    this.pilotGroupService.getPilotGroups().subscribe((data: PilotGroup[]) => this.pilotGroups = data);
    this.flightPackageService.getFlightPackages().subscribe(data => this.flightPackages = data);
    this.transportGroupService.getTransportGroups().subscribe(data => this.transportGroups = data);
    this.extraServiceService.getExtraServices().subscribe(data => this.extraServices = data);
    this.flightTimeService.getFlightTimes().subscribe(data => this.flightTimes = data);
    this.agencyService.getAgencies().subscribe(data => this.agencies = data);
    
    // Load countries from JSON
    this.http.get<Country[]>('/assets/js/Countries/countries.json').subscribe(data => {
      this.countries = data;
    });
  }

  updateFilteredPilots(index: number): void {
    const groupId = this.selectedGroupIds[index];
    if (!groupId) {
      this.filteredPilots[index] = this.pilots;
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
      if (this.reservation.flightDate) {
        // Parse the date and extract YYYY-MM-DD in local time to avoid timezone shifts
        const dateObj = new Date(this.reservation.flightDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        this.reservation.flightDate = `${year}-${month}-${day}`;
      }
      
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
      this.loadPayments(id);
    });
  }

  loadPayments(reservationId: number): void {
    this.paymentService.getPayments().subscribe(data => {
      this.payments = data.filter(p => p.reservationId === reservationId);
      this.calculateBalances();
    });
  }

  calculateBalances(): void {
    if (this.reservation.isAgencyBooking && this.reservation.agencyPrice !== undefined) {
      this.reservation.totalAmount = this.reservation.agencyPrice;
    }
    const totalDue = this.reservation.totalAmount || 0;
    const deposit = this.reservation.deposit || 0;
    this.totalPaid = this.payments.reduce((sum, p) => sum + Number(p.amount), 0) + Number(deposit);
    this.remainingBalance = Math.max(0, totalDue - this.totalPaid);
  }

  onAgencyPriceChange(): void {
    this.calculateBalances();
  }

  isFullyPaid(): boolean {
    const totalDue = this.reservation.totalAmount || 0;
    return this.totalPaid >= totalDue && totalDue > 0;
  }

  createEmptyDetail(): any {
    return {
      customerId: 0,
      pilotId: 0,
      flightPackageId: 0,
      transportGroupId: undefined,
      weightLimitStatus: false,
      extraServiceIds: [],
      customer: this.createEmptyCustomer()
    };
  }

  addDetail(): void {
    this.reservation.details.push(this.createEmptyDetail());
    this.updateFilteredPilots(this.reservation.details.length - 1);
  }

  removeDetail(index: number): void {
    if (this.reservation.details.length > 1) {
      this.reservation.details.splice(index, 1);
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
    
    // Ensure all numeric values are properly casted
    this.reservation.details.forEach(detail => {
      detail.customerId = Number(detail.customerId);
      if (detail.pilotId) {
        detail.pilotId = Number(detail.pilotId);
      } else {
        detail.pilotId = undefined;
      }
      detail.flightPackageId = Number(detail.flightPackageId);
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

    if (this.isEditing) {
      this.reservationService.updateReservation(this.reservation.id!, this.reservation).subscribe(() => {
        this.router.navigate(['/reservations']);
      });
    } else {
      this.reservationService.addReservation(this.reservation).subscribe(() => {
        this.router.navigate(['/reservations']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/reservations']);
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
    setTimeout(() => {
        const mapContainer = document.getElementById('pickupMap');
        if (!mapContainer) return;

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
}
