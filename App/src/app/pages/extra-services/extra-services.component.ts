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

  currentService: Partial<ExtraService> = { name: '', price: 0 };
  isEditing = false;

  addExtraService(): void {
    this.isEditing = false;
    this.currentService = { name: '', price: 0 };
  }

  editExtraService(es: ExtraService): void {
    this.isEditing = true;
    this.currentService = { ...es };
  }

  saveExtraService(): void {
    if (this.currentService.name && this.currentService.price !== undefined) {
      if (this.isEditing && this.currentService.id) {
        this.extraServiceService.updateExtraService(this.currentService.id, this.currentService as ExtraService).subscribe(() => {
          this.loadExtraServices();
          this.closeModal();
        });
      } else {
        this.extraServiceService.addExtraService(this.currentService as ExtraService).subscribe(() => {
          this.loadExtraServices();
          this.closeModal();
        });
      }
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('extraServiceModal');
    if (modalElement) {
      const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeBtn) closeBtn.click();
    }
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


