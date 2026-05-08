import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/models';
import { CountryService } from '../../services/country.service';

declare var bootstrap: any;

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css',
  standalone: false
})
export class CountriesComponent implements OnInit {
  countries: Country[] = [];
  currentCountry: Country = { id: 0, name: '', code: '' };
  isEditing = false;
  private modalInstance: any;

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (data) => this.countries = data,
      error: (err) => console.error('Error fetching countries', err)
    });
  }

  openModal(): void {
    const modalElement = document.getElementById('countryModal');
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

  addCountry(): void {
    this.isEditing = false;
    this.resetForm();
    this.openModal();
  }

  editCountry(c: Country): void {
    this.isEditing = true;
    this.currentCountry = { ...c };
    this.openModal();
  }

  saveCountry(): void {
    if (this.isEditing) {
      this.countryService.updateCountry(this.currentCountry.id!, this.currentCountry).subscribe({
        next: () => {
          this.loadCountries();
          this.closeModal();
        },
        error: (err) => console.error('Error updating country', err)
      });
    } else {
      const newCountry = { name: this.currentCountry.name, code: this.currentCountry.code };
      this.countryService.addCountry(newCountry).subscribe({
        next: () => {
          this.loadCountries();
          this.closeModal();
        },
        error: (err) => console.error('Error creating country', err)
      });
    }
  }

  deleteCountry(id: number): void {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countryService.deleteCountry(id).subscribe({
        next: () => this.loadCountries(),
        error: (err) => console.error('Error deleting country', err)
      });
    }
  }

  resetForm(): void {
    this.currentCountry = { id: 0, name: '', code: '' };
  }
}
