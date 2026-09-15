import { Component, OnInit } from '@angular/core';
import { ExtraService } from '../../models/models';
import { ExtraServiceService } from '../../services/extra-service.service';

declare var bootstrap: any;

@Component({
  selector: 'app-extra-services',
  standalone: false,
  templateUrl: './extra-services.component.html',
  styleUrl: './extra-services.component.css'
})
export class ExtraServicesComponent implements OnInit {
  extraServices: ExtraService[] = [];
  currentService: Partial<ExtraService> = { name: '', price: 0 };
  isEditing = false;
  searchTerm: string = '';
  private modalInstance: any;

  constructor(private extraServiceService: ExtraServiceService) {}

  ngOnInit(): void {
    this.loadExtraServices();
  }

  loadExtraServices(): void {
    this.extraServiceService.getExtraServices().subscribe({
      next: (data) => this.extraServices = data || [],
      error: (err) => console.error('Error fetching extra services', err)
    });
  }

  get filteredExtraServices(): ExtraService[] {
    if (!this.searchTerm) return this.extraServices;
    const term = this.searchTerm.toLowerCase();
    return this.extraServices.filter(s =>
      s.name && s.name.toLowerCase().includes(term)
    );
  }

  get averagePrice(): number {
    if (this.extraServices.length === 0) return 0;
    const sum = this.extraServices.reduce((acc, curr) => acc + (curr.price || 0), 0);
    return sum / this.extraServices.length;
  }

  get mediaServicesCount(): number {
    return this.extraServices.filter(s =>
      s.name && (
        s.name.toLowerCase().includes('photo') ||
        s.name.toLowerCase().includes('video') ||
        s.name.toLowerCase().includes('gopro') ||
        s.name.toLowerCase().includes('360')
      )
    ).length;
  }

  getServiceIcon(name?: string): string {
    if (!name) return 'bi-stars';
    const n = name.toLowerCase();
    if (n.includes('photo') || n.includes('camera')) return 'bi-camera-fill';
    if (n.includes('video') || n.includes('gopro') || n.includes('360')) return 'bi-camera-reels-fill';
    if (n.includes('transport') || n.includes('transfer') || n.includes('shuttle')) return 'bi-truck-front-fill';
    if (n.includes('insurance')) return 'bi-shield-check';
    if (n.includes('vip') || n.includes('sunset')) return 'bi-sun-fill';
    return 'bi-bag-check-fill';
  }

  openModal(): void {
    const modalElement = document.getElementById('extraServiceModal');
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

  addExtraService(): void {
    this.isEditing = false;
    this.currentService = { name: '', price: 0 };
    this.openModal();
  }

  editExtraService(es: ExtraService): void {
    this.isEditing = true;
    this.currentService = { ...es };
    this.openModal();
  }

  saveExtraService(): void {
    if (this.currentService.name && this.currentService.price !== undefined) {
      if (this.isEditing && this.currentService.id) {
        this.extraServiceService.updateExtraService(this.currentService.id, this.currentService as ExtraService).subscribe({
          next: () => {
            this.loadExtraServices();
            this.closeModal();
          },
          error: (err) => console.error('Error updating extra service', err)
        });
      } else {
        this.extraServiceService.addExtraService(this.currentService as ExtraService).subscribe({
          next: () => {
            this.loadExtraServices();
            this.closeModal();
          },
          error: (err) => console.error('Error adding extra service', err)
        });
      }
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
