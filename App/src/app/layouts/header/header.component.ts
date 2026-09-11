import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { ReservationPG } from '../../../main';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  public dossiers: Record<string, any>[] = []
  public user: User | null = null;
  lang: any = "En"
  rates: any = null;
  
  // Converter properties
  calcAmount: number = 0;
  calcFrom: string = 'USD';
  calcTo: string = 'TRY';
  calcResult: number = 0;

  // Custom Rates Modal
  customRates: any = { TRY: 0, EUR: 0, GBP: 0 };
  isSavingRates = false;

  displayCurrencies = ['USD', 'TRY', 'EUR', 'GBP'];

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private route: ActivatedRoute, 
    private router: Router,
    private currencyService: CurrencyService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => this.user = u);
    this.currencyService.rates$.subscribe(data => {
      this.rates = data;
      this.calculate();
    });
    this.lang = window.localStorage.getItem('lang');
  }

  calculate(): void {
    if (this.rates) {
      this.calcResult = this.currencyService.convert(this.calcAmount, this.calcFrom, this.calcTo);
    }
  }
  sidebarToggle() {
    if (window.innerWidth < 992) {
      document.body.classList.toggle('mobile-sidebar-open');
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.toggle('mobile-open');
      const backdrop = document.querySelector('.sidebar-backdrop');
      backdrop?.classList.toggle('show');
    } else {
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.toggle('toggle-sidebar2');
      const main = document.getElementById('main');
      main?.classList.toggle('main_toggele');
      document.body.classList.toggle('sidebar-collapsed');

      this.document.querySelectorAll('.nav-item span').forEach((e: any) => {
        e.classList.toggle('toggle-sidebar_text');
      });
      this.document.querySelectorAll('.nav-item ul').forEach((e: any) => {
        if (e.classList.contains('show'))
          e.classList.remove('show');
      });

      this.document.querySelectorAll('.bi-chevron-down').forEach((e: any) => {
        e.classList.toggle('toggle-sidebar_text');
      });

      this.document.querySelector('.prf')?.classList.toggle('d-md-block');
      this.document.querySelector('.prf')?.classList.toggle('d-none');
    }
  }

  onSelected(value: string): void {
    if (ReservationPG) {
      (ReservationPG as any).idDossier = value;
    }
    this.route.params.subscribe();
  }

  changeLangue(lang: string) {
    window.localStorage.setItem('lang', lang)
    window.location.reload()
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
