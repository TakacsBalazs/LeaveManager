import { Component, OnInit } from '@angular/core';
import { CreateUserRequest, FilterUsersRequest, Role, UpdateUserRequest, UserDto } from '../../models/user';
import { UserService } from '../../core/services/user.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  imports: [UserFormComponent, ConfirmModalComponent, ReactiveFormsModule],
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
  roles: Role[] = [];

  filterForm: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl(''),
    roles: new FormControl([])
  })

  constructor(private userService: UserService, private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.userService.getUsers(null).subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      }
    })

    this.userService.getRoles().subscribe({
      next: (resp) => {
        this.roles = resp;
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
          this.toast.success("Successfully edited the user!", 'Success');
        },
        error: (err) => {
          this.errors = err.error
          this.toast.error("Couldn't edit the user!", 'Error');
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
          this.toast.success("Successfully created the user!", 'Success');
        },
        error: (err) => {
          this.errors = err.error;
          this.toast.error("Couldn't create the user!", 'Error');
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
        this.toast.success("Successfully deleted the user!", 'Success');
      },
      error: () => {
        this.toast.error("Couldn't delete the user!", 'Error');
      }
    })
  }

  openConfirm(id: string){
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  onSubmitQuery(){
    const filter: FilterUsersRequest = {
      fullname: this.filterForm.value.fullname,
      email: this.filterForm.value.email,
      roles: this.filterForm.value.roles
    }
    this.isLoading = true
    this.userService.getUsers(filter).subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  onRoleChange(roleId: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const rolesArray = this.filterForm.get('roles')?.value as string[] || [];
  
    if (checkbox.checked) {
      this.filterForm.patchValue({roles: [...rolesArray, roleId]});
    } else {
      this.filterForm.patchValue({roles: rolesArray.filter(id => id !== roleId)});
    }
  }

  hasRole(roleId: string) {
    const currentRoles = this.filterForm.get('roles')?.value;
    return currentRoles.includes(roleId); 
  }
}
