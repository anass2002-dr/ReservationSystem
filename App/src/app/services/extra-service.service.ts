import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExtraService } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ExtraServiceService {
  private apiUrl = `${environment.ApiUrl}/ExtraService`;

  constructor(private http: HttpClient) { }

  getExtraServices(): Observable<ExtraService[]> {
    return this.http.get<ExtraService[]>(`${this.apiUrl}/GetExtraServices`);
  }

  getExtraService(id: number): Observable<ExtraService> {
    return this.http.get<ExtraService>(`${this.apiUrl}/GetExtraServiceById/${id}`);
  }

  addExtraService(extraService: ExtraService): Observable<ExtraService> {
    return this.http.post<ExtraService>(`${this.apiUrl}/AddExtraService`, extraService);
  }

  updateExtraService(id: number, extraService: ExtraService): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateExtraService/${id}`, extraService);
  }

  deleteExtraService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteExtraService/${id}`);
  }
}
