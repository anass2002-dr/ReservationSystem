import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FlightPackage } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FlightPackageService {
  private apiUrl = `${environment.ApiUrl}/FlightPackage`;

  constructor(private http: HttpClient) { }

  getFlightPackages(): Observable<FlightPackage[]> {
    return this.http.get<FlightPackage[]>(`${this.apiUrl}/GetFlightPackages`);
  }

  getFlightPackage(id: number): Observable<FlightPackage> {
    return this.http.get<FlightPackage>(`${this.apiUrl}/GetFlightPackageById/${id}`);
  }

  addFlightPackage(flightPackage: FlightPackage): Observable<FlightPackage> {
    return this.http.post<FlightPackage>(`${this.apiUrl}/AddFlightPackage`, flightPackage);
  }

  updateFlightPackage(id: number, flightPackage: FlightPackage): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateFlightPackage/${id}`, flightPackage);
  }

  deleteFlightPackage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteFlightPackage/${id}`);
  }
}
