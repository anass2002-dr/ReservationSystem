import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Country } from '../../models/models';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-countries',
  standalone: false,
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent implements OnInit {
  countries: Country[] = [];

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

  addCountry(): void {
    // Navigate or open modal
  }

  editCountry(c: Country): void {
    // Navigate or open modal
  }

  deleteCountry(id: number): void {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countryService.deleteCountry(id).subscribe({
        next: () => this.loadCountries(),
        error: (err) => console.error('Error deleting country', err)
      });
    }
  }
}


