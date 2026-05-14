import { Component, OnInit } from '@angular/core';
import { FlightTime } from '../../models/models';
import { FlightTimeService } from '../../services/flight-time.service';

@Component({
  selector: 'app-flight-times',
  standalone: false,
  templateUrl: './flight-times.component.html',
  styleUrl: './flight-times.component.css'
})
export class FlightTimesComponent implements OnInit {
  flightTimes: FlightTime[] = [];
  isLoading = false;
  
  // For add/edit
  isEditing = false;
  currentFlightTime: FlightTime = { time: '', isActive: true };

  constructor(private flightTimeService: FlightTimeService) { }

  ngOnInit(): void {
    this.loadFlightTimes();
  }

  loadFlightTimes(): void {
    this.isLoading = true;
    this.flightTimeService.getFlightTimes().subscribe({
      next: (data) => {
        this.flightTimes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading flight times', err);
        this.isLoading = false;
      }
    });
  }

  onAdd(): void {
    this.isEditing = false;
    this.currentFlightTime = { time: '', isActive: true };
  }

  onEdit(item: FlightTime): void {
    this.isEditing = true;
    this.currentFlightTime = { ...item };
  }

  save(): void {
    if (!this.currentFlightTime.time) return;

    if (this.isEditing) {
      this.flightTimeService.updateFlightTime(this.currentFlightTime.id!, this.currentFlightTime).subscribe({
        next: () => {
          this.loadFlightTimes();
          this.resetForm();
        },
        error: (err) => console.error('Error updating flight time', err)
      });
    } else {
      this.flightTimeService.addFlightTime(this.currentFlightTime).subscribe({
        next: () => {
          this.loadFlightTimes();
          this.resetForm();
        },
        error: (err) => console.error('Error adding flight time', err)
      });
    }
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this flight time?')) {
      this.flightTimeService.deleteFlightTime(id).subscribe({
        next: () => this.loadFlightTimes(),
        error: (err) => console.error('Error deleting flight time', err)
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentFlightTime = { time: '', isActive: true };
    // Close modal if using one, but here we use a card/inline
  }
}
