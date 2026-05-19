import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reservation } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.ApiUrl}/Reservation`;

  constructor(private http: HttpClient) { }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/GetReservations`);
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/GetReservationById/${id}`);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/AddReservation`, reservation);
  }

  updateReservation(id: number, reservation: Reservation): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateReservation/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteReservation/${id}`);
  }

  updatePilotAttendance(detailId: number, status: number, note?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdatePilotAttendance/${detailId}`, { status, note });
  }
}
