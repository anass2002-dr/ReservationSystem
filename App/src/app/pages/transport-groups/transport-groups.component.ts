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

  addTransportGroup(): void {
    // Navigate or open modal
  }

  editTransportGroup(tg: TransportGroup): void {
    // Navigate or open modal
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


