import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { NotificationResponse } from '../../models/notification';
import { MessageResponse } from '../../models/api-responses';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`

  constructor(private http: HttpClient) { }

  getUserAllNotification(): Observable<NotificationResponse[]>{
    return this.http.get<NotificationResponse[]>(this.apiUrl);
  }

  getNotification(id: number): Observable<NotificationResponse>{
    return this.http.get<NotificationResponse>(`${this.apiUrl}/${id}`);
  }

  deleteNotification(id: number): Observable<MessageResponse>{
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}`);
  }
}
