import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ReservationPG } from '../../../main';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { AuthService, User } from '../../services/auth.service';
import { LanguageService, SupportedLanguage } from '../../services/language.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  public dossiers: Record<string, any>[] = [];
  public user: User | null = null;
  rates: any = null;
  
  calcAmount: number = 0;
  calcFrom: string = 'USD';
  calcTo: string = 'TRY';
  calcResult: number = 0;

  customRates: any = { TRY: 0, EUR: 0, GBP: 0 };
  isSavingRates = false;

  displayCurrencies = ['USD', 'TRY', 'EUR', 'GBP'];

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private route: ActivatedRoute, 
    private router: Router,
    private currencyService: CurrencyService,
    public authService: AuthService,
    public languageService: LanguageService,
    public sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => this.user = u);
    this.currencyService.rates$.subscribe(data => {
      this.rates = data;
      this.calculate();
    });
  }

  get currentLang(): SupportedLanguage {
    return this.languageService.currentLanguage;
  }

  calculate(): void {
    if (this.rates) {
      this.calcResult = this.currencyService.convert(this.calcAmount, this.calcFrom, this.calcTo);
    }
  }

  sidebarToggle() {
    this.sidebarService.toggleSidebar();
  }


  onSelected(value: string): void {
    if (ReservationPG) {
      (ReservationPG as any).idDossier = value;
    }
    this.route.params.subscribe();
  }

  changeLangue(lang: string) {
    this.languageService.setLanguage(lang as SupportedLanguage);
  }

  logout() {
    this.authService.logout();
  }

  openRatesModal(): void {
    if (this.rates) {
      this.customRates = {
        TRY: this.rates['TRY'] || 0,
        EUR: this.rates['EUR'] || 0,
        GBP: this.rates['GBP'] || 0
      };
    }
  }

  saveCustomRates(): void {
    this.isSavingRates = true;
    const newRates = {
      USD: 1,
      TRY: Number(this.customRates.TRY),
      EUR: Number(this.customRates.EUR),
      GBP: Number(this.customRates.GBP)
    };
    
    this.currencyService.updateCustomRates(newRates).subscribe({
      next: () => {
        this.isSavingRates = false;
        const closeBtn = document.getElementById('closeRatesModalBtn');
        if (closeBtn) closeBtn.click();
      },
      error: (err) => {
        console.error('Error saving custom rates', err);
        this.isSavingRates = false;
      }
    });
  }
}
