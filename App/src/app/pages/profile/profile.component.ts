import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  apiUrl = `${environment.ApiUrl}/Auth`;

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => this.user = u);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select an image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.uploadProfileImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfileImage(base64Image: string): void {
    if (!this.user) return;

    this.http.post(`${this.apiUrl}/users/${this.user.id}/profile-image`, { profileImageUrl: base64Image })
      .subscribe({
        next: () => {
          if (this.user) {
            this.user.profileImageUrl = base64Image;
            // Update local storage to persist the image across refreshes
            localStorage.setItem('currentUser', JSON.stringify(this.user));
            Swal.fire('Success', 'Profile picture updated!', 'success');
          }
        },
        error: (err) => {
          console.error('Upload failed', err);
          Swal.fire('Error', 'Failed to upload image', 'error');
        }
      });
  }
}
