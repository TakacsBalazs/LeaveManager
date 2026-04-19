import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeaveBalanceResponse } from '../../models/leave';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveBalanceService {
  private apiUrl = "https://localhost:7171/api/leavebalances"; 

  constructor(private http: HttpClient) { }

  
  getAllLeaveBalances(): Observable<LeaveBalanceResponse[]>{
    return this.http.get<LeaveBalanceResponse[]>(this.apiUrl)
  }
}