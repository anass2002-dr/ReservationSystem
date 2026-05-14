import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation, ReservationStatus, Customer, Pilot, FlightTime, Payment } from '../../models/models';
import { ReservationService } from '../../services/reservation.service';
import { CustomerService } from '../../services/customer.service';
import { PilotService } from '../../services/pilot.service';
import { FlightTimeService } from '../../services/flight-time.service';
import { PaymentService } from '../../services/payment.service';
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

  constructor(
    private reservationService: ReservationService,
    private customerService: CustomerService,
    private pilotService: PilotService,
    private flightTimeService: FlightTimeService,
    private paymentService: PaymentService,
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

  getPassengersCount(res: Reservation): number {
    return res.details ? res.details.length : 0;
  }

  isFullyPaid(res: Reservation): boolean {
    const totalDue = res.totalAmount || 0;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return paid >= totalDue && totalDue > 0;
  }

  getRemainingBalance(res: Reservation): number {
    const totalDue = res.totalAmount || 0;
    const paid = this.payments
      .filter(p => p.reservationId === res.id)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return Math.max(0, totalDue - paid);
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
