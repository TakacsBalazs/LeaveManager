import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MessageResponse } from '../../models/api-responses';
import { ChangePasswordRequest } from '../../models/auth';

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
    const token = localStorage.getItem('jwt_token');
    if(!token){
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem('jwt_token')
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem('jwt_token');
      return false;
    }
  }

  getRole(): string | string[] | null {
    const token = localStorage.getItem('jwt_token');
    if(!token){
      return null;
    } 
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken.role;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
  const role = this.getRole();
  if (!role) return false;

  if (Array.isArray(role)) {
    return role.includes('Admin');
  }

  return role === 'Admin';
  }

  logout(){
    localStorage.removeItem('jwt_token');
  }
}
