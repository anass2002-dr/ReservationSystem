import { Component, OnInit } from '@angular/core';
import { TransportGroup } from '../../models/models';
import { TransportGroupService } from '../../services/transport-group.service';

declare var bootstrap: any;

@Component({
  selector: 'app-transport-groups',
  standalone: false,
  templateUrl: './transport-groups.component.html',
  styleUrl: './transport-groups.component.css'
})
export class TransportGroupsComponent implements OnInit {
  transportGroups: TransportGroup[] = [];
  currentGroup: Partial<TransportGroup> = { departureTime: '', vehiclePlate: '', driverName: '' };
  isEditing = false;
  searchTerm: string = '';
  private modalInstance: any;

  constructor(private transportGroupService: TransportGroupService) {}

  ngOnInit(): void {
    this.loadTransportGroups();
  }

  loadTransportGroups(): void {
    this.transportGroupService.getTransportGroups().subscribe({
      next: (data) => this.transportGroups = data || [],
      error: (err) => console.error('Error fetching transport groups', err)
    });
  }

  get filteredTransportGroups(): TransportGroup[] {
    if (!this.searchTerm) return this.transportGroups;
    const term = this.searchTerm.toLowerCase();
    return this.transportGroups.filter(tg =>
      (tg.vehiclePlate && tg.vehiclePlate.toLowerCase().includes(term)) ||
      (tg.driverName && tg.driverName.toLowerCase().includes(term))
    );
  }

  get uniqueVehiclesCount(): number {
    const plates = new Set(this.transportGroups.map(tg => tg.vehiclePlate).filter(Boolean));
    return plates.size;
  }

  get uniqueDriversCount(): number {
    const drivers = new Set(this.transportGroups.map(tg => tg.driverName).filter(Boolean));
    return drivers.size;
  }

  openModal(): void {
    const modalElement = document.getElementById('transportGroupModal');
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

  addTransportGroup(): void {
    this.isEditing = false;
    this.currentGroup = { departureTime: '', vehiclePlate: '', driverName: '' };
    this.openModal();
  }

  editTransportGroup(tg: TransportGroup): void {
    this.isEditing = true;
    this.currentGroup = { ...tg };
    if (this.currentGroup.departureTime) {
      this.currentGroup.departureTime = new Date(this.currentGroup.departureTime).toISOString().slice(0, 16);
    }
    this.openModal();
  }

  saveTransportGroup(): void {
    if (this.currentGroup.departureTime && this.currentGroup.vehiclePlate && this.currentGroup.driverName) {
      if (this.isEditing && this.currentGroup.id) {
        this.transportGroupService.updateTransportGroup(this.currentGroup.id, this.currentGroup as TransportGroup).subscribe({
          next: () => {
            this.loadTransportGroups();
            this.closeModal();
          },
          error: (err) => console.error('Error updating transport group', err)
        });
      } else {
        this.transportGroupService.addTransportGroup(this.currentGroup as TransportGroup).subscribe({
          next: () => {
            this.loadTransportGroups();
            this.closeModal();
          },
          error: (err) => console.error('Error adding transport group', err)
        });
      }
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
