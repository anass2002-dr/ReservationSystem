import { Component, OnInit } from '@angular/core';
import { Customer, Country } from '../../models/models';
import { CustomerService } from '../../services/customer.service';
import { CountryService } from '../../services/country.service';

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
  currentCustomer: Customer = { id: 0, fullName: '', dateOfBirth: '', phoneNumber: '', email: '', countryId: undefined };
  isEditing = false;
  private modalInstance: any;

  constructor(
    private customerService: CustomerService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadCountries();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Error fetching customers', err)
    });
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (data) => this.countries = data,
      error: (err) => console.error('Error fetching countries', err)
    });
  }

  getCountryName(countryId?: number): string {
    if (!countryId) return '-';
    const country = this.countries.find(c => c.id === countryId);
    return country ? country.name : '-';
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
    
    // Format date for the input type="date"
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
      // Backend creates ID
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
    this.currentCustomer = { id: 0, fullName: '', dateOfBirth: '', phoneNumber: '', email: '', countryId: undefined };
  }
}
