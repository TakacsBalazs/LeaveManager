import { Component, OnInit } from '@angular/core';
import { UserDto } from '../../models/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  data: UserDto[] = [];
  isLoading = true;

  constructor(private userService: UserService) {
    
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      }
    })
  }
}
