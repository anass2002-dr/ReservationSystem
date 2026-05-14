import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-exchange-rates',
  standalone: false,
  templateUrl: './exchange-rates.component.html',
  styleUrl: './exchange-rates.component.css'
})
export class ExchangeRatesComponent implements OnInit {
  rates: any = null;
  lastUpdated: string | null = null;
  isRefreshing = false;

  displayCurrencies = ['TRY', 'USD', 'EUR', 'GBP'];

  // Calculator
  calcAmount: number = 0;
  calcFrom: string = 'USD';
  calcTo: string = 'TRY';
  calcResult: number = 0;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.rates$.subscribe(data => {
      this.rates = data;
      this.lastUpdated = localStorage.getItem('exchange_rates_updated');
      this.calculate();
    });
  }

  calculate(): void {
    if (this.rates) {
      this.calcResult = this.currencyService.convert(this.calcAmount, this.calcFrom, this.calcTo);
    }
  }

  swapCurrencies(): void {
    const temp = this.calcFrom;
    this.calcFrom = this.calcTo;
    this.calcTo = temp;
    this.calculate();
  }

  refresh(): void {
    this.isRefreshing = true;
    this.currencyService.refreshRates().subscribe({
      next: () => {
        this.isRefreshing = false;
      },
      error: (err) => {
        console.error('Error refreshing rates', err);
        this.isRefreshing = false;
      }
    });
  }

  getRateLabel(code: string): string {
    switch(code) {
      case 'TRY': return 'Turkish Lira';
      case 'USD': return 'US Dollar';
      case 'EUR': return 'Euro';
      case 'GBP': return 'British Pound';
      default: return code;
    }
  }

  getIcon(code: string): string {
    switch(code) {
      case 'TRY': return 'bi-currency-bitcoin'; // Closest for TL sometimes, or use custom
      case 'USD': return 'bi-currency-dollar';
      case 'EUR': return 'bi-currency-euro';
      case 'GBP': return 'bi-currency-pound';
      default: return 'bi-cash-stack';
    }
  }
}
