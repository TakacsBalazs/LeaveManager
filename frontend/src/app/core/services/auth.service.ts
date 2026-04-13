import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "https://localhost:7171/api/auth";

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const response = {email: email, password: password};

    return this.http.post<any>(`${this.apiUrl}/login`, response).pipe(
      tap(response => {
        if(response && response.accessToken){
          localStorage.setItem('jwt_token', response.accessToken);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }
}
