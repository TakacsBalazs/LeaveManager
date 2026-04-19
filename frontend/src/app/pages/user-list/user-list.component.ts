import { Component, OnInit } from '@angular/core';
import { CreateUserRequest, UpdateUserRequest, UserDto } from '../../models/user';
import { UserService } from '../../core/services/user.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-user-list',
  imports: [UserFormComponent, ConfirmModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  data: UserDto[] = [];
  isLoading = true;
  isModalOpen = false;
  selectedUser: UserDto | null = null;
  errors: string[] = [];
  isConfirmOpen = false;
  idToDelete: string | null = null;

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

  openCreateModal(): void {
    this.errors = [];
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  openEditModal(user: UserDto): void {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleUser(formData: any) {
    if(this.selectedUser){
      const user: UpdateUserRequest = {
        fullname: formData.fullname,
        email: formData.email,
        roles: formData.roles
      };

      this.userService.updateUser(user, this.selectedUser.id).subscribe({
        next: (resp) => {
          const userInd = this.data.findIndex(x => x.id == this.selectedUser!.id);
          this.data[userInd] = resp;
          this.closeModal();
        },
        error: (err) => {
          this.errors = err.error
        }
      })

    } else {
      const user: CreateUserRequest = {
        fullname: formData.fullname,
        email: formData.email,
        roles: formData.roles,
        password: formData.password
      };

      this.userService.createUser(user).subscribe({
        next: (resp) => {
          this.data.push(resp);
          this.closeModal();
        },
        error: (err) => {
          this.errors = err.error
        }
      })
    }
  }

  onDelete(){
    if(!this.idToDelete){
      return;
    }

    this.userService.deleteUser(this.idToDelete).subscribe({
      next: () => {
        const userInd = this.data.findIndex(x => x.id == this.idToDelete);
        this.data.splice(userInd, 1);
        this.idToDelete = null;
        this.isConfirmOpen = false;
      }
    })
  }

  openConfirm(id: string){
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }
}
