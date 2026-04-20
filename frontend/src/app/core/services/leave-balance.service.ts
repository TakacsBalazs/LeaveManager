import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateLeaveBalanceRequest, LeaveBalanceResponse, FilterLeaveBalance, UpdateLeaveBalanceRequest } from '../../models/leave-balance';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/api-responses';
import { buildCleanParams } from '../utils/http.utils';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveBalanceService {
  private apiUrl = `${environment.apiUrl}/leavebalances`; 

  constructor(private http: HttpClient) { }

  
  getAllLeaveBalances(filters: FilterLeaveBalance | null): Observable<LeaveBalanceResponse[]>{
    const cleanParams = buildCleanParams(filters);

    return this.http.get<LeaveBalanceResponse[]>(this.apiUrl, {params: cleanParams});
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