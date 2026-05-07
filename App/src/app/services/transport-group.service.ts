import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransportGroup } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class TransportGroupService {
  private apiUrl = `${environment.ApiUrl}/TransportGroup`;

  constructor(private http: HttpClient) { }

  getTransportGroups(): Observable<TransportGroup[]> {
    return this.http.get<TransportGroup[]>(`${this.apiUrl}/GetTransportGroups`);
  }

  getTransportGroup(id: number): Observable<TransportGroup> {
    return this.http.get<TransportGroup>(`${this.apiUrl}/GetTransportGroupById/${id}`);
  }

  addTransportGroup(transportGroup: TransportGroup): Observable<TransportGroup> {
    return this.http.post<TransportGroup>(`${this.apiUrl}/AddTransportGroup`, transportGroup);
  }

  updateTransportGroup(id: number, transportGroup: TransportGroup): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateTransportGroup/${id}`, transportGroup);
  }

  deleteTransportGroup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteTransportGroup/${id}`);
  }
}
