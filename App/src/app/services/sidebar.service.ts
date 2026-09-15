import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly STORAGE_KEY = 'rs_sidebar_collapsed';

  // Desktop collapsed state (false = expanded 260px, true = mini 80px)
  private isCollapsedSubject = new BehaviorSubject<boolean>(this.loadInitialCollapsedState());
  public isCollapsed$ = this.isCollapsedSubject.asObservable();

  // Mobile drawer open state (false = closed off-screen, true = open)
  private isMobileOpenSubject = new BehaviorSubject<boolean>(false);
  public isMobileOpen$ = this.isMobileOpenSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 992 && this.isMobileOpenSubject.value) {
          this.isMobileOpenSubject.next(false);
        }
      });
    }
  }

  get isCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  get isMobileOpen(): boolean {
    return this.isMobileOpenSubject.value;
  }

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      this.isMobileOpenSubject.next(!this.isMobileOpenSubject.value);
    } else {
      const nextVal = !this.isCollapsedSubject.value;
      this.isCollapsedSubject.next(nextVal);
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nextVal));
      } catch (e) {}
    }
  }

  setCollapsed(collapsed: boolean): void {
    this.isCollapsedSubject.next(collapsed);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collapsed));
    } catch (e) {}
  }

  closeMobile(): void {
    this.isMobileOpenSubject.next(false);
  }

  openMobile(): void {
    this.isMobileOpenSubject.next(true);
  }

  private loadInitialCollapsedState(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return false; // Default is Expanded (260px) on desktop
  }
}
