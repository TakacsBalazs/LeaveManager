import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CreateLeaveRequestDto } from '../../models/leave';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = "https://localhost:7171/api/leaverequests"; 

  constructor(private http: HttpClient) { }

  createLeaveRequest(data: CreateLeaveRequestDto ): Observable<any>{
    return this.http.post<CreateLeaveRequestDto>(this.apiUrl, data);
  }
}
