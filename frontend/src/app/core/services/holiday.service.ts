import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateHolidayRequest, HolidayResponse } from '../../models/holiday';
import { MessageResponse } from '../../models/api-responses';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private apiUrl = `${environment.apiUrl}/holidays`

  constructor(private http: HttpClient) { }

  getAllHolidays(): Observable<HolidayResponse[]>{
    return this.http.get<HolidayResponse[]>(this.apiUrl);
  }

  createHoliday(request: CreateHolidayRequest): Observable<HolidayResponse>{
    return this.http.post<HolidayResponse>(this.apiUrl, request);
  }

  deleteHoliday(id: number): Observable<MessageResponse>{
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}`)
  }
}
