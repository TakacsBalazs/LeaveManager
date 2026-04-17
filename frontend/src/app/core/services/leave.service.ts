import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateLeaveRequestDto, LeaveRequestDto } from '../../models/leave';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/api-responses';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = "https://localhost:7171/api/leaverequests"; 

  constructor(private http: HttpClient) { }

  createLeaveRequest(data: CreateLeaveRequestDto ): Observable<MessageResponse>{
    return this.http.post<MessageResponse>(this.apiUrl, data);
  }

  getMyLeaveRequests(): Observable<LeaveRequestDto[]> {
    return this.http.get<LeaveRequestDto[]>(`${this.apiUrl}/my`);
  }

  cancelTheRequests(id: number): Observable<MessageResponse>{
    return this.http.post<MessageResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
