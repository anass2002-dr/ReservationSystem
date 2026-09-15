import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public sidebarService: SidebarService
  ) { }

  ngOnInit(): void {}

  closeMobileSidebar(): void {
    this.sidebarService.closeMobile();
  }
}