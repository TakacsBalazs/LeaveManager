import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MessageResponse } from '../../models/api-responses';
import { ChangePasswordRequest } from '../../models/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  public logoutEvent$ = new Subject<void>();

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
    
    this.logoutEvent$.next();
  }
  
  changePassword(request: ChangePasswordRequest): Observable<MessageResponse>{
    return this.http.post<MessageResponse>(`${this.apiUrl}/changepassword`, request).pipe(
      tap({
        next: () => {
          this.logout();
        }
      })
    );
  }
}
