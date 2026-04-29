import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDto } from '../../models/user';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit{
  @Input() user: UserDto | null = null;
  @Input() errors: string[] = [];
  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<UserDto>();

  userForm!: FormGroup;

  availableRoles = ['Admin', 'Employee']

  ngOnInit(): void{
    this.userForm = new FormGroup({
      fullname: new FormControl(this.user?.fullname || '', [Validators.required]),
      email: new FormControl(this.user?.email || '', [Validators.required, Validators.email]),
      password: new FormControl('', this.user ? [] : [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).*$/)]),
      roles: new FormControl(this.user?.roles || [], [Validators.required])
    })
  }

  onSubmit(): void {
    if(this.userForm.valid){
      this.saveForm.emit(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onCancel(): void{
    this.closeForm.emit();
  }

  onRoleChange(role: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    const rolesControl = this.userForm.get('roles');
    
    const currentRoles = rolesControl?.value as string[];
  
    if (isChecked) {
      rolesControl?.setValue([...currentRoles, role]);
    } else {
      rolesControl?.setValue(currentRoles.filter(r => r !== role));
    }

    rolesControl?.markAsTouched();
  }
}
