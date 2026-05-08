import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation, ReservationStatus, Customer, Pilot } from '../../models/models';
import { ReservationService } from '../../services/reservation.service';
import { CustomerService } from '../../services/customer.service';
import { PilotService } from '../../services/pilot.service';

@Component({
  selector: 'app-reservations',
  standalone: false,
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  customers: Customer[] = [];
  pilots: Pilot[] = [];

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private pilotService: PilotService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadReservations();
  }

  loadLookups(): void {
    this.customerService.getCustomers().subscribe(data => this.customers = data);
    this.pilotService.getPilots().subscribe(data => this.pilots = data);
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Error fetching reservations', err)
    });
  }

  getCustomerName(id: number): string {
    const c = this.customers.find(x => x.id === id);
    return c ? c.fullName : id.toString();
  }

  getPilotName(id: number): string {
    const p = this.pilots.find(x => x.id === id);
    return p ? p.fullName : id.toString();
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
    this.router.navigate(['/Reservations/Add']);
  }

  editReservation(r: Reservation): void {
    this.router.navigate(['/Reservations/Edit', r.id]);
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
