import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateLeaveRequestDto, FilterLeaveRequestCalendar, LeaveRequestCalendar, LeaveRequestDto } from '../../models/leave-request';
import { Observable } from 'rxjs';
import { MessageResponse } from '../../models/api-responses';
import { environment } from '../../../environments/environment';
import { buildCleanParams } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  private apiUrl = `${environment.apiUrl}/leaverequests`; 

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

  getRequestById(id: number): Observable<LeaveRequestDto>{
    return this.http.get<LeaveRequestDto>(`${this.apiUrl}/${id}`);
  }

  approveRequest(id: number): Observable<MessageResponse>{
    return this.http.post<MessageResponse>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectRequest(id: number): Observable<MessageResponse>{
    return this.http.post<MessageResponse>(`${this.apiUrl}/${id}/reject`, {});
  }

  getAllPendingRequests(): Observable<LeaveRequestDto[]>{
    return this.http.get<LeaveRequestDto[]>(`${this.apiUrl}/allpendingrequests`);
  }

  getLeaveRequestCalendar(filters: FilterLeaveRequestCalendar | null): Observable<LeaveRequestCalendar[]>{
    const cleanParams = buildCleanParams(filters);

    return this.http.get<LeaveRequestCalendar[]>(`${this.apiUrl}/getleaverequestcalendar`, {params: cleanParams})
  }
}
