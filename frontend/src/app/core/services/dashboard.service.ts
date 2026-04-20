import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardDto } from '../../models/dashboard';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`; 

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardDto>{
    return this.http.get<DashboardDto>(this.apiUrl);
  }
}
