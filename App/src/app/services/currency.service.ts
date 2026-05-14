import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiKey = 'deb3aa330c620dcd9c85b5a3';
  private apiUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/USD`;
  
  private ratesSubject = new BehaviorSubject<any>(null);
  public rates$ = this.ratesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadRatesFromStorage();
  }

  refreshRates(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(data => {
        if (data && data.conversion_rates) {
          this.ratesSubject.next(data.conversion_rates);
          localStorage.setItem('exchange_rates', JSON.stringify(data.conversion_rates));
          localStorage.setItem('exchange_rates_updated', new Date().toISOString());
        }
      })
    );
  }

  private loadRatesFromStorage(): void {
    const saved = localStorage.getItem('exchange_rates');
    if (saved) {
      this.ratesSubject.next(JSON.parse(saved));
    } else {
      this.refreshRates().subscribe();
    }
  }

  getRates(): any {
    return this.ratesSubject.value;
  }

  convert(amount: number, from: string, to: string): number {
    const rates = this.getRates();
    if (!rates) return amount;
    
    // Convert from 'from' to USD first (base), then to 'to'
    const inUsd = amount / rates[from];
    return inUsd * rates[to];
  }
}
