import { Component, OnInit } from '@angular/core';
import { Customer, Country } from '../../models/models';
import { CustomerService } from '../../services/customer.service';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  countries: Country[] = [];
  currentCustomer: Customer = { id: 0, fullName: '', dateOfBirth: '', phoneNumber: '', email: '', country: undefined };
  isEditing = false;
  searchTerm: string = '';
  selectedCountryFilter: string = '';
  private modalInstance: any;

  constructor(
    private customerService: CustomerService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadCountries();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers = data || [],
      error: (err) => console.error('Error fetching customers', err)
    });
  }

  loadCountries(): void {
    this.http.get<Country[]>('/assets/js/Countries/countries.json').subscribe({
      next: (data) => this.countries = data || [],
      error: (err) => console.error('Error fetching countries', err)
    });
  }

  get filteredCustomers(): Customer[] {
    return this.customers.filter(c => {
      const matchesSearch = !this.searchTerm ||
        (c.fullName && c.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (c.phoneNumber && c.phoneNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (c.country && c.country.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesCountry = !this.selectedCountryFilter || c.country === this.selectedCountryFilter;

      return matchesSearch && matchesCountry;
    });
  }

  get uniqueCountriesCount(): number {
    const set = new Set(this.customers.map(c => c.country).filter(Boolean));
    return set.size;
  }

  get contactableCount(): number {
    return this.customers.filter(c => c.phoneNumber || c.email).length;
  }

  getAge(dateOfBirth: string | Date | undefined): string {
    if (!dateOfBirth) return '-';
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) return '-';
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    const age = Math.abs(ageDt.getUTCFullYear() - 1970);
    return `${age} yrs`;
  }

  getInitials(name: string): string {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getCountryName(country?: string): string {
    return country || '-';
  }

  openModal(): void {
    const modalElement = document.getElementById('customerModal');
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

  addCustomer(): void {
    this.isEditing = false;
    this.resetForm();
    this.openModal();
  }

  editCustomer(c: Customer): void {
    this.isEditing = true;
    this.currentCustomer = { ...c };
    
    if (this.currentCustomer.dateOfBirth) {
      this.currentCustomer.dateOfBirth = new Date(this.currentCustomer.dateOfBirth).toISOString().split('T')[0];
    }
    
    this.openModal();
  }

  saveCustomer(): void {
    if (this.isEditing) {
      this.customerService.updateCustomer(this.currentCustomer.id!, this.currentCustomer).subscribe({
        next: () => {
          this.loadCustomers();
          this.closeModal();
        },
        error: (err) => console.error('Error updating customer', err)
      });
    } else {
      const newCustomer = { ...this.currentCustomer };
      this.customerService.addCustomer(newCustomer).subscribe({
        next: () => {
          this.loadCustomers();
          this.closeModal();
        },
        error: (err) => console.error('Error creating customer', err)
      });
    }
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => this.loadCustomers(),
        error: (err) => console.error('Error deleting customer', err)
      });
    }
  }

  resetForm(): void {
    this.currentCustomer = { id: 0, fullName: '', dateOfBirth: '', phoneNumber: '', email: '', country: undefined };
  }
}
