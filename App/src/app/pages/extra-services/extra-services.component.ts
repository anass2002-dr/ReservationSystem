import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExtraService } from '../../models/models';
import { ExtraServiceService } from '../../services/extra-service.service';

@Component({
  selector: 'app-extra-services',
  standalone: false,
  templateUrl: './extra-services.component.html',
  styleUrl: './extra-services.component.css'
})
export class ExtraServicesComponent implements OnInit {
  extraServices: ExtraService[] = [];

  constructor(private extraServiceService: ExtraServiceService) {}

  ngOnInit(): void {
    this.loadExtraServices();
  }

  loadExtraServices(): void {
    this.extraServiceService.getExtraServices().subscribe({
      next: (data) => this.extraServices = data,
      error: (err) => console.error('Error fetching extra services', err)
    });
  }

  addExtraService(): void {
    // Navigate or open modal
  }

  editExtraService(es: ExtraService): void {
    // Navigate or open modal
  }

  deleteExtraService(id: number): void {
    if (confirm('Are you sure you want to delete this extra service?')) {
      this.extraServiceService.deleteExtraService(id).subscribe({
        next: () => this.loadExtraServices(),
        error: (err) => console.error('Error deleting extra service', err)
      });
    }
  }
}


