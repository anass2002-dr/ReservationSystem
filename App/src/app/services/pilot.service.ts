import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pilot } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class PilotService {
  private apiUrl = `${environment.ApiUrl}/Pilot`;

  constructor(private http: HttpClient) { }

  getPilots(): Observable<Pilot[]> {
    return this.http.get<Pilot[]>(`${this.apiUrl}/GetPilots`);
  }

  getPilot(id: number): Observable<Pilot> {
    return this.http.get<Pilot>(`${this.apiUrl}/GetPilotById/${id}`);
  }

  addPilot(pilot: Pilot): Observable<Pilot> {
    return this.http.post<Pilot>(`${this.apiUrl}/AddPilot`, pilot);
  }

  updatePilot(id: number, pilot: Pilot): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdatePilot/${id}`, pilot);
  }

  deletePilot(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeletePilot/${id}`);
  }
}
