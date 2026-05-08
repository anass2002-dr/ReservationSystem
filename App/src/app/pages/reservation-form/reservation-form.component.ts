import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  Reservation, ReservationStatus, Customer, Pilot, 
  FlightPackage, TransportGroup, ExtraService 
} from '../../models/models';
import { ReservationService } from '../../services/reservation.service';
import { CustomerService } from '../../services/customer.service';
import { PilotService } from '../../services/pilot.service';
import { FlightPackageService } from '../../services/flight-package.service';
import { TransportGroupService } from '../../services/transport-group.service';
import { ExtraServiceService } from '../../services/extra-service.service';

@Component({
  selector: 'app-reservation-form',
  standalone: false,
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {
  isEditing = false;
  reservationId: number | null = null;

  ReservationStatus = ReservationStatus;
  statusOptions = [
    { value: ReservationStatus.Pending, label: 'Pending' },
    { value: ReservationStatus.Confirmed, label: 'Confirmed' },
    { value: ReservationStatus.Cancelled, label: 'Cancelled' }
  ];

  reservation: Reservation = {
    flightDate: '',
    weightLimitStatus: false,
    status: ReservationStatus.Pending,
    customerId: 0,
    pilotId: 0,
    flightPackageId: 0,
    transportGroupId: undefined,
    extraServiceIds: []
  };

  customers: Customer[] = [];
  pilots: Pilot[] = [];
  flightPackages: FlightPackage[] = [];
  transportGroups: TransportGroup[] = [];
  extraServices: ExtraService[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private pilotService: PilotService,
    private flightPackageService: FlightPackageService,
    private transportGroupService: TransportGroupService,
    private extraServiceService: ExtraServiceService
  ) {}

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

  loadLookups(): void {
    this.customerService.getCustomers().subscribe(data => this.customers = data);
    this.pilotService.getPilots().subscribe(data => this.pilots = data);
    this.flightPackageService.getFlightPackages().subscribe(data => this.flightPackages = data);
    this.transportGroupService.getTransportGroups().subscribe(data => this.transportGroups = data);
    this.extraServiceService.getExtraServices().subscribe(data => this.extraServices = data);
  }

  loadReservation(id: number): void {
    this.reservationService.getReservation(id).subscribe(data => {
      this.reservation = data;
      if (this.reservation.flightDate) {
        this.reservation.flightDate = new Date(this.reservation.flightDate).toISOString().slice(0, 16);
      }
    });
  }

  save(): void {
    this.reservation.status = Number(this.reservation.status);
    this.reservation.customerId = Number(this.reservation.customerId);
    this.reservation.pilotId = Number(this.reservation.pilotId);
    this.reservation.flightPackageId = Number(this.reservation.flightPackageId);
    if (this.reservation.transportGroupId) {
       this.reservation.transportGroupId = Number(this.reservation.transportGroupId);
    }

    if (this.isEditing) {
      this.reservationService.updateReservation(this.reservation.id!, this.reservation).subscribe(() => {
        this.router.navigate(['/Reservations']);
      });
    } else {
      this.reservationService.addReservation(this.reservation).subscribe(() => {
        this.router.navigate(['/Reservations']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/Reservations']);
  }
}
