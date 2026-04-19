import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangePasswordRequest } from '../../models/auth';

@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.scss'
})
export class ChangePasswordFormComponent implements OnInit{
  @Input() errors: string[] = [];
  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<ChangePasswordRequest>();

  changePasswordForm!: FormGroup;

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit(){
    if(this.changePasswordForm.valid){
      this.saveForm.emit(this.changePasswordForm.value);
    }
  }

  onCancel(){
    this.closeForm.emit();
  }
}
