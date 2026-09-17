import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Agency, AgencyAnalytics } from '../../models/models';
import { AgencyService } from '../../services/agency.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-agencies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.css']
})
export class AgenciesComponent implements OnInit {
  activeTab: 'analytics' | 'directory' = 'analytics';

  agencies: Agency[] = [];
  analyticsList: AgencyAnalytics[] = [];
  filteredAnalytics: AgencyAnalytics[] = [];

  currentAgency: Agency = { name: '' };
  isEditing = false;
  isLoading = true;

  // Search & Filter
  searchTerm = '';
  statusFilter: 'ALL' | 'DUE' | 'SETTLED' = 'ALL';

  // Selected agency for detailed statement modal
  selectedAgency: AgencyAnalytics | null = null;

  // Summary KPI Totals
  totalAgenciesCount = 0;
  totalAgencyBookings = 0;
  totalClientsSent = 0;
  totalTurnoverAmount = 0;
  totalPaidAmount = 0;
  totalRemainingBalance = 0;

  constructor(private agencyService: AgencyService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.loadAgencies();
    this.loadAnalytics();
  }

  loadAgencies(): void {
    this.agencyService.getAgencies().subscribe({
      next: (data) => {
        this.agencies = data || [];
        this.totalAgenciesCount = this.agencies.length;
      },
      error: (err) => console.error('Error loading agencies:', err)
    });
  }

  loadAnalytics(): void {
    this.agencyService.getAgenciesAnalytics().subscribe({
      next: (data) => {
        this.analyticsList = data || [];
        this.calculateTotals();
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading agency analytics:', err);
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalAgencyBookings = this.analyticsList.reduce((acc, item) => acc + (item.totalReservations || 0), 0);
    this.totalClientsSent = this.analyticsList.reduce((acc, item) => acc + (item.totalPassengers || 0), 0);
    this.totalTurnoverAmount = this.analyticsList.reduce((acc, item) => acc + (item.totalAgreedAmount || 0), 0);
    this.totalPaidAmount = this.analyticsList.reduce((acc, item) => acc + (item.totalPaidAmount || 0), 0);
    this.totalRemainingBalance = this.analyticsList.reduce((acc, item) => acc + (item.remainingBalance || 0), 0);
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredAnalytics = this.analyticsList.filter(item => {
      const matchesSearch = !term ||
        item.agencyName?.toLowerCase().includes(term) ||
        item.contactPerson?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.phoneNumber?.toLowerCase().includes(term);

      let matchesStatus = true;
      if (this.statusFilter === 'DUE') {
        matchesStatus = item.remainingBalance > 0;
      } else if (this.statusFilter === 'SETTLED') {
        matchesStatus = item.remainingBalance === 0 && item.totalReservations > 0;
      }

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  setStatusFilter(filter: 'ALL' | 'DUE' | 'SETTLED'): void {
    this.statusFilter = filter;
    this.applyFilter();
  }

  openStatement(item: AgencyAnalytics): void {
    this.selectedAgency = item;
  }

  printStatement(): void {
    window.print();
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
    if (this.isEditing && this.currentAgency.id) {
      this.agencyService.updateAgency(this.currentAgency.id, this.currentAgency).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error updating agency:', err)
      });
    } else {
      this.agencyService.addAgency(this.currentAgency).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error adding agency:', err)
      });
    }
  }

  deleteAgency(id: number): void {
    if (confirm('Are you sure you want to delete this agency?')) {
      this.agencyService.deleteAgency(id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error deleting agency:', err)
      });
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
