import { Component, OnInit } from '@angular/core';
import { Agency } from '../../models/models';
import { AgencyService } from '../../services/agency.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agencies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.css']
})
export class AgenciesComponent implements OnInit {
  agencies: Agency[] = [];
  currentAgency: Agency = { name: '' };
  isEditing = false;

  constructor(private agencyService: AgencyService) { }

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies(): void {
    this.agencyService.getAgencies().subscribe(data => this.agencies = data);
  }

  addAgency(): void {
    this.isEditing = false;
    this.currentAgency = { name: '' };
  }

  editAgency(agency: Agency): void {
    this.isEditing = true;
    this.currentAgency = { ...agency };
  }

  saveAgency(): void {
    if (this.isEditing) {
      this.agencyService.updateAgency(this.currentAgency.id!, this.currentAgency).subscribe(() => {
        this.loadAgencies();
        this.closeModal();
      });
    } else {
      this.agencyService.addAgency(this.currentAgency).subscribe(() => {
        this.loadAgencies();
        this.closeModal();
      });
    }
  }

  deleteAgency(id: number): void {
    if (confirm('Are you sure you want to delete this agency?')) {
      this.agencyService.deleteAgency(id).subscribe(() => this.loadAgencies());
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('agencyModal');
    if (modalElement) {
      const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeButton) closeButton.click();
    }
  }
}
