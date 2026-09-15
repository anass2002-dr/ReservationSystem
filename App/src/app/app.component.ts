import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ReservationSystemApp';

  constructor(
    public authService: AuthService,
    public sidebarService: SidebarService
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}



