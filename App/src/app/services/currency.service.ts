import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = `${environment.ApiUrl}/ExchangeRate`;
  
  private ratesSubject = new BehaviorSubject<any>(null);
  public rates$ = this.ratesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadRatesFromStorage();
  }

  refreshRates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetRates`).pipe(
      tap(data => {
        if (data && data['USD']) {
          this.ratesSubject.next(data);
          localStorage.setItem('exchange_rates', JSON.stringify(data));
          localStorage.setItem('exchange_rates_updated', new Date().toISOString());
        }
      })
    );
  }

  updateCustomRates(newRates: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/UpdateRates`, newRates).pipe(
      tap(() => {
        // Optimistically update local state immediately
        this.ratesSubject.next(newRates);
        localStorage.setItem('exchange_rates', JSON.stringify(newRates));
        localStorage.setItem('exchange_rates_updated', new Date().toISOString());
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
