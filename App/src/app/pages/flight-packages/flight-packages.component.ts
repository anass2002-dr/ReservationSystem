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

  currentPackage: Partial<FlightPackage> = { title: '', price: 0 };
  isEditing = false;

  addFlightPackage(): void {
    this.isEditing = false;
    this.currentPackage = { title: '', price: 0 };
  }

  editFlightPackage(fp: FlightPackage): void {
    this.isEditing = true;
    this.currentPackage = { ...fp };
  }

  saveFlightPackage(): void {
    if (this.currentPackage.title && this.currentPackage.price !== undefined) {
      if (this.isEditing && this.currentPackage.id) {
        this.flightPackageService.updateFlightPackage(this.currentPackage.id, this.currentPackage as FlightPackage).subscribe(() => {
          this.loadFlightPackages();
          this.closeModal();
        });
      } else {
        this.flightPackageService.addFlightPackage(this.currentPackage as FlightPackage).subscribe(() => {
          this.loadFlightPackages();
          this.closeModal();
        });
      }
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('flightPackageModal');
    if (modalElement) {
      const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeBtn) closeBtn.click();
    }
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


