import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  apiUrl = 'http://localhost:5265/api/Auth';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Could not load users', err)
    });
  }

  openRegisterModal(): void {
    Swal.fire({
      title: 'Add New User',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Username">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Email">' +
        '<input id="swal-input3" class="swal2-input" type="password" placeholder="Password">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Full Name">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create User',
      preConfirm: () => {
        return {
          username: (document.getElementById('swal-input1') as HTMLInputElement).value,
          email: (document.getElementById('swal-input2') as HTMLInputElement).value,
          password: (document.getElementById('swal-input3') as HTMLInputElement).value,
          fullName: (document.getElementById('swal-input4') as HTMLInputElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`${this.apiUrl}/register`, result.value).subscribe({
          next: () => {
            Swal.fire('Success', 'User created successfully', 'success');
            this.loadUsers();
          },
          error: () => Swal.fire('Error', 'Failed to create user', 'error')
        });
      }
    });
  }

  editUser(user: User): void {
    Swal.fire({
      title: 'Edit User',
      html:
        `<input id="edit-fullname" class="swal2-input" placeholder="Full Name" value="${user.fullName || ''}">` +
        `<input id="edit-email" class="swal2-input" placeholder="Email" value="${user.email || ''}">`,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        return {
          fullName: (document.getElementById('edit-fullname') as HTMLInputElement).value,
          email: (document.getElementById('edit-email') as HTMLInputElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`${this.apiUrl}/users/${user.id}`, result.value).subscribe({
          next: () => {
            Swal.fire('Updated', 'User updated successfully', 'success');
            this.loadUsers();
          },
          error: () => Swal.fire('Error', 'Failed to update user', 'error')
        });
      }
    });
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete user ${user.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/users/${user.id}`).subscribe({
          next: () => {
            Swal.fire('Deleted', 'User has been deleted', 'success');
            this.loadUsers();
          },
          error: () => Swal.fire('Error', 'Failed to delete user', 'error')
        });
      }
    });
  }

  resetPassword(user: User): void {
    Swal.fire({
      title: 'Reset Password',
      text: `Set new password for ${user.username}`,
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Reset Password',
      showLoaderOnConfirm: true,
      preConfirm: (newPassword) => {
        if (!newPassword) {
          Swal.showValidationMessage('Password is required');
          return;
        }
        return this.http.post(`${this.apiUrl}/users/${user.id}/reset-password`, { newPassword }).toPromise()
          .catch(error => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Success', 'Password has been reset', 'success');
      }
    });
  }
}
