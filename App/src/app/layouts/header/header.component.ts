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
    this.document.querySelectorAll('.nav-item span').forEach((e: any) => {
      e.classList.toggle('toggle-sidebar_text')
    })
    this.document.querySelectorAll('.nav-item ul').forEach((e: any) => {
      if (e.classList.contains('show'))
        e.classList.remove('show')
    })

    this.document.querySelectorAll('.bi-chevron-down').forEach((e: any) => {
      e.classList.toggle('toggle-sidebar_text')
    })
    this.document.querySelector('.sidebar')?.classList.toggle('toggle-sidebar2')

    this.document.querySelector('.prf')?.classList.toggle('d-md-block')
    this.document.querySelector('.prf')?.classList.toggle('d-none')
    this.document.querySelector('.main')?.classList.toggle('main_toggele')
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
}
