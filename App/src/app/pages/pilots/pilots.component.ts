import { Component, OnInit } from '@angular/core';
import { Pilot, PilotStatus } from '../../models/models';
import { PilotService } from '../../services/pilot.service';

declare var bootstrap: any;

@Component({
  selector: 'app-pilots',
  standalone: false,
  templateUrl: './pilots.component.html',
  styleUrl: './pilots.component.css'
})
export class PilotsComponent implements OnInit {
  pilots: Pilot[] = [];
  currentPilot: Pilot = { id: 0, fullName: '', licenseNumber: '', status: PilotStatus.Active };
  isEditing = false;
  private modalInstance: any;

  PilotStatus = PilotStatus;
  statusOptions = [
    { value: PilotStatus.Active, label: 'Active' },
    { value: PilotStatus.InFlight, label: 'In Flight' },
    { value: PilotStatus.OffDuty, label: 'Off Duty' }
  ];

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

  getStatusLabel(status: PilotStatus): string {
    const found = this.statusOptions.find(o => o.value === status);
    return found ? found.label : 'Unknown';
  }

  getStatusBadgeClass(status: PilotStatus): string {
    switch (status) {
      case PilotStatus.Active: return 'bg-success';
      case PilotStatus.InFlight: return 'bg-warning text-dark';
      case PilotStatus.OffDuty: return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }

  openModal(): void {
    const modalElement = document.getElementById('pilotModal');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  addPilot(): void {
    this.isEditing = false;
    this.resetForm();
    this.openModal();
  }

  editPilot(p: Pilot): void {
    this.isEditing = true;
    this.currentPilot = { ...p };
    this.openModal();
  }

  savePilot(): void {
    this.currentPilot.status = Number(this.currentPilot.status);

    if (this.isEditing) {
      this.pilotService.updatePilot(this.currentPilot.id!, this.currentPilot).subscribe({
        next: () => {
          this.loadPilots();
          this.closeModal();
        },
        error: (err) => console.error('Error updating pilot', err)
      });
    } else {
      const newPilot = { ...this.currentPilot };
      delete newPilot.id;
      this.pilotService.addPilot(newPilot).subscribe({
        next: () => {
          this.loadPilots();
          this.closeModal();
        },
        error: (err) => console.error('Error creating pilot', err)
      });
    }
  }

  deletePilot(id: number): void {
    if (confirm('Are you sure you want to delete this pilot?')) {
      this.pilotService.deletePilot(id).subscribe({
        next: () => this.loadPilots(),
        error: (err) => console.error('Error deleting pilot', err)
      });
    }
  }

  resetForm(): void {
    this.currentPilot = { id: 0, fullName: '', licenseNumber: '', status: PilotStatus.Active };
  }
}
