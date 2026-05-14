import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FlightTime } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class FlightTimeService {
  private apiUrl = `${environment.ApiUrl}/FlightTime`;

  constructor(private http: HttpClient) { }

  getFlightTimes(): Observable<FlightTime[]> {
    return this.http.get<FlightTime[]>(`${this.apiUrl}/GetFlightTimes`);
  }

  getFlightTime(id: number): Observable<FlightTime> {
    return this.http.get<FlightTime>(`${this.apiUrl}/GetFlightTimeById/${id}`);
  }

  addFlightTime(item: FlightTime): Observable<FlightTime> {
    return this.http.post<FlightTime>(`${this.apiUrl}/AddFlightTime`, item);
  }

  updateFlightTime(id: number, item: FlightTime): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateFlightTime/${id}`, item);
  }

  deleteFlightTime(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteFlightTime/${id}`);
  }
}
