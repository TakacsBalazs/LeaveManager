import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, UserDropdown, UserDto } from '../../models/user';
import { MessageResponse } from '../../models/api-responses';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "https://localhost:7171/api/users"

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserDto[]>{
    return this.http.get<UserDto[]>(this.apiUrl);
  }
}
