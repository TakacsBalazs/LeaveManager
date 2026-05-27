import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserRequest, FilterUsersRequest, Role, UpdateUserRequest, UploadProfilePictureRequest, UserDropdown, UserDto } from '../../models/user';
import { MessageResponse } from '../../models/api-responses';
import { buildCleanParams } from '../utils/http.utils';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`

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

  uploadProfilePicture(request: UploadProfilePictureRequest): Observable<MessageResponse>{

    const formData = new FormData();
    formData.append('file', request.file, request.file.name);

    return this.http.post<MessageResponse>(`${this.apiUrl}/upload-profile-picture`, formData);
  }
}
