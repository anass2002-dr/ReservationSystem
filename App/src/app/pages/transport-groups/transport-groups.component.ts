import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransportGroup } from '../../models/models';
import { TransportGroupService } from '../../services/transport-group.service';

@Component({
  selector: 'app-transport-groups',
  standalone: false,
  templateUrl: './transport-groups.component.html',
  styleUrl: './transport-groups.component.css'
})
export class TransportGroupsComponent implements OnInit {
  transportGroups: TransportGroup[] = [];

  constructor(private transportGroupService: TransportGroupService) {}

  ngOnInit(): void {
    this.loadTransportGroups();
  }

  loadTransportGroups(): void {
    this.transportGroupService.getTransportGroups().subscribe({
      next: (data) => this.transportGroups = data,
      error: (err) => console.error('Error fetching transport groups', err)
    });
  }

  currentGroup: Partial<TransportGroup> = { departureTime: '', vehiclePlate: '', driverName: '' };
  isEditing = false;

  addTransportGroup(): void {
    this.isEditing = false;
    this.currentGroup = { departureTime: '', vehiclePlate: '', driverName: '' };
  }

  editTransportGroup(tg: TransportGroup): void {
    this.isEditing = true;
    this.currentGroup = { ...tg };
    if (this.currentGroup.departureTime) {
      this.currentGroup.departureTime = new Date(this.currentGroup.departureTime).toISOString().slice(0, 16);
    }
  }

  saveTransportGroup(): void {
    if (this.currentGroup.departureTime && this.currentGroup.vehiclePlate && this.currentGroup.driverName) {
      if (this.isEditing && this.currentGroup.id) {
        this.transportGroupService.updateTransportGroup(this.currentGroup.id, this.currentGroup as TransportGroup).subscribe(() => {
          this.loadTransportGroups();
          this.closeModal();
        });
      } else {
        this.transportGroupService.addTransportGroup(this.currentGroup as TransportGroup).subscribe(() => {
          this.loadTransportGroups();
          this.closeModal();
        });
      }
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('transportGroupModal');
    if (modalElement) {
      const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeBtn) closeBtn.click();
    }
  }

  deleteTransportGroup(id: number): void {
    if (confirm('Are you sure you want to delete this transport group?')) {
      this.transportGroupService.deleteTransportGroup(id).subscribe({
        next: () => this.loadTransportGroups(),
        error: (err) => console.error('Error deleting transport group', err)
      });
    }
  }
}


