import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadProfilePictureRequest } from '../../models/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-profile-picture-form',
  imports: [ReactiveFormsModule],
  templateUrl: './upload-profile-picture-form.component.html',
  styleUrl: './upload-profile-picture-form.component.scss'
})
export class UploadProfilePictureFormComponent implements OnInit{
  @Input() errors: string[] = [];
  @Output() saveForm = new EventEmitter<UploadProfilePictureRequest>();
  @Output() closeForm = new EventEmitter<void>();

  profilePictureForm!: FormGroup

  ngOnInit(): void {
    this.profilePictureForm = new FormGroup({
      file: new FormControl(null, [Validators.required])
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.profilePictureForm.patchValue({
        file: file
      })
    }
  }

  onSubmit(){
    if (this.profilePictureForm.valid) {
      this.saveForm.emit(this.profilePictureForm.value);
    }
  }

  onCancel(){
    this.closeForm.emit();
  }
}
