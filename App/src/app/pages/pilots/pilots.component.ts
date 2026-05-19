import { Component, OnInit } from '@angular/core';
import { Pilot, PilotStatus, PilotGroup, Reservation, ReservationDetail, PilotAttendanceStatus } from '../../models/models';
import { PilotService } from '../../services/pilot.service';
import { PilotGroupService } from '../../services/pilot-group.service';
import { ReservationService } from '../../services/reservation.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

export interface RosterItem {
  detailId: number;
  reservationId: number;
  reservationTitle: string;
  flightDate: string;
  pilotId: number;
  pilotName: string;
  attendance: PilotAttendanceStatus;
  note?: string;
}

@Component({
  selector: 'app-pilots',
  standalone: false,
  templateUrl: './pilots.component.html',
  styleUrl: './pilots.component.css'
})
export class PilotsComponent implements OnInit {
  pilots: Pilot[] = [];
  currentPilot: Pilot = { id: 0, fullName: '', licenseNumber: '', status: PilotStatus.Active, flightsAssigned: 0, flightsFlown: 0 };
  isEditing = false;
  private modalInstance: any;

  activeTab: 'directory' | 'roster' = 'directory';

  PilotStatus = PilotStatus;
  statusOptions = [
    { value: PilotStatus.Active, label: 'Active' },
    { value: PilotStatus.InFlight, label: 'Out of Insurance' },
    { value: PilotStatus.OffDuty, label: 'Not Active' }
  ];

  pilotGroups: PilotGroup[] = [];
  showGroupModal = false;
  isEditingGroup = false;
  currentGroup: PilotGroup = { name: '' };

  reservations: Reservation[] = [];
  rosterItems: RosterItem[] = [];

  constructor(
    private pilotService: PilotService,
    private pilotGroupService: PilotGroupService,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.loadPilots();
    this.loadPilotGroups();
    this.loadReservations();
  }

  getGroupName(groupId?: number): string {
    if (!groupId) return '-';
    const group = this.pilotGroups.find(g => g.id === groupId);
    return group ? group.name : '-';
  }

  loadPilotGroups(): void {
    this.pilotGroupService.getPilotGroups().subscribe((groups: PilotGroup[]) => {
      this.pilotGroups = groups;
      this.sortPilots();
    });
  }

  loadPilots(): void {
    this.pilotService.getPilots().subscribe({
      next: (data) => {
        this.pilots = data;
        this.sortPilots();
        this.buildRoster();
      },
      error: (err) => console.error('Error fetching pilots', err)
    });
  }

  sortPilots(): void {
    if (!this.pilots.length) return;
    this.pilots = [...this.pilots].sort((a, b) => {
      // 1. Group comparison (by group name)
      const groupA = this.getGroupName(a.pilotGroupId);
      const groupB = this.getGroupName(b.pilotGroupId);
      if (groupA !== groupB) {
        // Keep 'No Group' (which returns '-') at the bottom
        if (groupA === '-') return 1;
        if (groupB === '-') return -1;
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

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.buildRoster();
      },
      error: (err) => console.error('Error fetching reservations', err)
    });
  }

  buildRoster(): void {
    this.rosterItems = [];
    for (const res of this.reservations) {
      if (res.details) {
        for (const det of res.details) {
          if (det.pilotId) {
            const pilot = this.pilots.find(p => p.id === det.pilotId);
            this.rosterItems.push({
              detailId: det.id!,
              reservationId: res.id!,
              reservationTitle: res.title || 'Untitled Reservation',
              flightDate: res.flightDate,
              pilotId: det.pilotId,
              pilotName: pilot ? pilot.fullName : 'Unknown Pilot',
              attendance: det.pilotAttendance || PilotAttendanceStatus.Pending,
              note: det.pilotNote
            });
          }
        }
      }
    }
    // Sort so Pending is at top
    this.rosterItems.sort((a, b) => {
      if (a.attendance === PilotAttendanceStatus.Pending && b.attendance !== PilotAttendanceStatus.Pending) return -1;
      if (a.attendance !== PilotAttendanceStatus.Pending && b.attendance === PilotAttendanceStatus.Pending) return 1;
      return new Date(b.flightDate).getTime() - new Date(a.flightDate).getTime();
    });
  }

  setActiveTab(tab: 'directory' | 'roster'): void {
    this.activeTab = tab;
  }

  confirmFlight(item: RosterItem): void {
    Swal.fire({
      title: 'Confirm Flight',
      text: `Are you sure ${item.pilotName} completed this flight?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirmed',
      confirmButtonColor: '#198754'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.updatePilotAttendance(item.detailId, PilotAttendanceStatus.Confirmed).subscribe(() => {
          Swal.fire('Confirmed!', 'The flight has been recorded and pilot stats updated.', 'success');
          this.loadPilots();
          this.loadReservations();
        });
      }
    });
  }

  markNoShow(item: RosterItem): void {
    Swal.fire({
      title: 'Pilot Did Not Come',
      input: 'textarea',
      inputLabel: 'Reason / Note',
      inputPlaceholder: 'Why did the pilot miss this flight?',
      showCancelButton: true,
      confirmButtonText: 'Submit No-Show',
      confirmButtonColor: '#dc3545',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write a note!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.reservationService.updatePilotAttendance(item.detailId, PilotAttendanceStatus.NoShow, result.value).subscribe(() => {
          Swal.fire('Recorded!', 'The no-show has been logged and pilot stats updated.', 'success');
          this.loadPilots();
          this.loadReservations();
        });
      }
    });
  }

  // Directory UI Methods
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
    if (this.currentPilot.flightsAssigned === undefined) this.currentPilot.flightsAssigned = 0;
    if (this.currentPilot.flightsFlown === undefined) this.currentPilot.flightsFlown = 0;
    this.openModal();
  }

  savePilot(): void {
    this.currentPilot.status = Number(this.currentPilot.status);
    if (this.currentPilot.pilotGroupId) {
      this.currentPilot.pilotGroupId = Number(this.currentPilot.pilotGroupId);
    } else {
      this.currentPilot.pilotGroupId = undefined;
    }

    if (this.isEditing) {
      this.pilotService.updatePilot(this.currentPilot.id!, this.currentPilot).subscribe({
        next: () => {
          this.loadPilots();
          this.closeModal();
          this.buildRoster(); // to refresh names if changed
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
    Swal.fire({
      title: 'Delete Pilot?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pilotService.deletePilot(id).subscribe({
          next: () => {
            this.loadPilots();
            Swal.fire('Deleted!', 'Pilot has been deleted.', 'success');
          },
          error: (err) => console.error('Error deleting pilot', err)
        });
      }
    });
  }

  resetForm(): void {
    this.currentPilot = { id: 0, fullName: '', licenseNumber: '', status: PilotStatus.Active, flightsAssigned: 0, flightsFlown: 0 };
  }

  // Group Management
  openGroupModal(group?: PilotGroup): void {
    if (group) {
      this.isEditingGroup = true;
      this.currentGroup = { ...group };
    } else {
      this.isEditingGroup = false;
      this.currentGroup = { name: '' };
    }
    this.showGroupModal = true;
  }

  closeGroupModal(): void {
    this.showGroupModal = false;
  }

  saveGroup(): void {
    if (this.isEditingGroup) {
      this.pilotGroupService.updatePilotGroup(this.currentGroup.id!, this.currentGroup).subscribe(() => {
        this.loadPilotGroups();
        this.closeGroupModal();
      });
    } else {
      this.pilotGroupService.createPilotGroup(this.currentGroup).subscribe(() => {
        this.loadPilotGroups();
        this.closeGroupModal();
      });
    }
  }

  deleteGroup(id: number): void {
    Swal.fire({
      title: 'Delete Group?',
      text: "Are you sure?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pilotGroupService.deletePilotGroup(id).subscribe(() => this.loadPilotGroups());
      }
    });
  }

  getTotalFlightsFlown(): number {
    return this.pilots.reduce((sum, p) => sum + (p.flightsFlown || 0), 0);
  }
}
