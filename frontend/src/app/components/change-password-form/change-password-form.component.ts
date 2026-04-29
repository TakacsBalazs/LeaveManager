import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).*$/)]),
      confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).*$/)])
    }, { validators: this.passwordConfirmationValidator })
  }

  passwordConfirmationValidator(group: AbstractControl){
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;

    if(newPassword !== confirmNewPassword) {
      return { passwordConfirmationInvalid: true };
    }
    
    return null;
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
