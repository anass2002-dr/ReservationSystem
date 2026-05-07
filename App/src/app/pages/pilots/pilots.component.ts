import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pilot } from '../../models/models';
import { PilotService } from '../../services/pilot.service';

@Component({
  selector: 'app-pilots',
  standalone: false,
  templateUrl: './pilots.component.html',
  styleUrl: './pilots.component.css'
})
export class PilotsComponent implements OnInit {
  pilots: Pilot[] = [];

  constructor(private pilotService: PilotService) {}

  ngOnInit(): void {
    this.loadPilots();
  }

  loadPilots(): void {
    this.pilotService.getPilots().subscribe({
      next: (data) => this.pilots = data,
      error: (err) => console.error('Error fetching pilots', err)
    });
  }

  addPilot(): void {
    // Navigate or open modal
  }

  editPilot(pilot: Pilot): void {
    // Navigate or open modal
  }

  deletePilot(id: number): void {
    if (confirm('Are you sure you want to delete this pilot?')) {
      this.pilotService.deletePilot(id).subscribe({
        next: () => this.loadPilots(),
        error: (err) => console.error('Error deleting pilot', err)
      });
    }
  }
}


