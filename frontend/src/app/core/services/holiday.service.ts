import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HolidayResponse } from '../../models/holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  private apiUrl = `${environment.apiUrl}/holidays`

  constructor(private http: HttpClient) { }

  getAllHolidays(): Observable<HolidayResponse[]>{
    return this.http.get<HolidayResponse[]>(this.apiUrl);
  }
}
