import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserRequest, FilterUsersRequest, Role, UpdateUserRequest, UserDropdown, UserDto } from '../../models/user';
import { MessageResponse } from '../../models/api-responses';
import { buildCleanParams } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "https://localhost:7171/api/users"

  constructor(private http: HttpClient) { }

  getUsers(filters: FilterUsersRequest | null): Observable<UserDto[]>{
    const cleanParams = buildCleanParams(filters);

    return this.http.get<UserDto[]>(this.apiUrl, { params: cleanParams });
  }

  createUser(request: CreateUserRequest): Observable<UserDto>{
    return this.http.post<UserDto>(this.apiUrl, request);
  }

  updateUser(request: UpdateUserRequest, id: string): Observable<UserDto>{
    return this.http.put<UserDto>(`${this.apiUrl}/${id}`, request);
  }

  deleteUser(id: string): Observable<MessageResponse>{
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${id}`);
  }

  getUsersForDropdown(): Observable<UserDropdown[]>{
    return this.http.get<UserDropdown[]>(`${this.apiUrl}/dropdown`);
  }

  getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }
}
