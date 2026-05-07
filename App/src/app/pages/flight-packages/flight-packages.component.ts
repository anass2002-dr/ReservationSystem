import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightPackage } from '../../models/models';
import { FlightPackageService } from '../../services/flight-package.service';

@Component({
  selector: 'app-flight-packages',
  standalone: false,
  templateUrl: './flight-packages.component.html',
  styleUrl: './flight-packages.component.css'
})
export class FlightPackagesComponent implements OnInit {
  flightPackages: FlightPackage[] = [];

  constructor(private flightPackageService: FlightPackageService) {}

  ngOnInit(): void {
    this.loadFlightPackages();
  }

  loadFlightPackages(): void {
    this.flightPackageService.getFlightPackages().subscribe({
      next: (data) => this.flightPackages = data,
      error: (err) => console.error('Error fetching flight packages', err)
    });
  }

  addFlightPackage(): void {
    // Navigate or open modal
  }

  editFlightPackage(fp: FlightPackage): void {
    // Navigate or open modal
  }

  deleteFlightPackage(id: number): void {
    if (confirm('Are you sure you want to delete this flight package?')) {
      this.flightPackageService.deleteFlightPackage(id).subscribe({
        next: () => this.loadFlightPackages(),
        error: (err) => console.error('Error deleting flight package', err)
      });
    }
  }
}


