import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PilotGroup } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PilotGroupService {
  private apiUrl = `${environment.ApiUrl}/PilotGroups`;

  constructor(private http: HttpClient) { }

  getPilotGroups(): Observable<PilotGroup[]> {
    return this.http.get<PilotGroup[]>(this.apiUrl);
  }

  getPilotGroup(id: number): Observable<PilotGroup> {
    return this.http.get<PilotGroup>(`${this.apiUrl}/${id}`);
  }

  createPilotGroup(pilotGroup: PilotGroup): Observable<PilotGroup> {
    return this.http.post<PilotGroup>(this.apiUrl, pilotGroup);
  }

  updatePilotGroup(id: number, pilotGroup: PilotGroup): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, pilotGroup);
  }

  deletePilotGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
