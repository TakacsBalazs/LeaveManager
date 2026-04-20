import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateLeaveBalanceRequest, LeaveBalanceResponse, UpdateLeaveBalanceRequest } from '../../models/leave-balance';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/api-responses';

@Injectable({
  providedIn: 'root'
})
export class LeaveBalanceService {
  private apiUrl = "https://localhost:7171/api/leavebalances"; 

  constructor(private http: HttpClient) { }

  
  getAllLeaveBalances(): Observable<LeaveBalanceResponse[]>{
    return this.http.get<LeaveBalanceResponse[]>(this.apiUrl)
  }

  createLeaveBalance(request: CreateLeaveBalanceRequest): Observable<LeaveBalanceResponse>{
    return this.http.post<LeaveBalanceResponse>(this.apiUrl, request);
  }

  updateLeaveBalance(request: UpdateLeaveBalanceRequest, id: number): Observable<LeaveBalanceResponse>{
    return this.http.put<LeaveBalanceResponse>(`${this.apiUrl}/${id}`, request);
  }

  deleteLeaveBalance(id: number): Observable<MessageResponse>{
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}`);
  }
}