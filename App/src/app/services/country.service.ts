import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Country } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = `${environment.ApiUrl}/Country`;

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/GetCountrys`);
  }

  getCountry(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/GetCountryById/${id}`);
  }

  addCountry(country: Country): Observable<Country> {
    return this.http.post<Country>(`${this.apiUrl}/AddCountry`, country);
  }

  updateCountry(id: number, country: Country): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateCountry/${id}`, country);
  }

  deleteCountry(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteCountry/${id}`);
  }
}
