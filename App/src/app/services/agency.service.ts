import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agency } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = `${environment.ApiUrl}/Agency`;

  constructor(private http: HttpClient) { }

  getAgencies(): Observable<Agency[]> {
    return this.http.get<Agency[]>(`${this.apiUrl}/GetAgencies`);
  }

  getAgencyById(id: number): Observable<Agency> {
    return this.http.get<Agency>(`${this.apiUrl}/GetAgencyById/${id}`);
  }

  addAgency(agency: Agency): Observable<Agency> {
    return this.http.post<Agency>(`${this.apiUrl}/AddAgency`, agency);
  }

  updateAgency(id: number, agency: Agency): Observable<Agency> {
    return this.http.put<Agency>(`${this.apiUrl}/UpdateAgency/${id}`, agency);
  }

  deleteAgency(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteAgency/${id}`);
  }
}
