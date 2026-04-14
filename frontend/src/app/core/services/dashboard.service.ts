import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardDto } from '../../models/dashboard';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = "https://localhost:7171/api/dashboard"; 

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardDto>{
    return this.http.get<DashboardDto>(this.apiUrl);
  }
}
