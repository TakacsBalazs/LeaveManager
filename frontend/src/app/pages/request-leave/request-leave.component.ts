import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateLeaveRequestDto } from '../../models/leave-request';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-leave',
  imports: [ReactiveFormsModule],
  templateUrl: './request-leave.component.html',
  styleUrl: './request-leave.component.scss'
})
export class RequestLeaveComponent {
  minDate: string;
  errors: string[] | null = null;
  constructor(private leaveRequestService: LeaveRequestService, private router: Router, private toast: ToastrService){
    this.minDate = new Date().toISOString().split('T')[0];
  }

  requestForm = new FormGroup({
    type: new FormControl(0, Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    reason: new FormControl('')
  })

  onSubmit(){
    const formValue = this.requestForm.value;
    
    this.errors = [];
    const startDate = new Date(formValue.startDate!);
    const endDate = new Date(formValue.endDate!);
    if(endDate < startDate){
      this.errors.push("End date cannot be before the start date.");
      return;
    }

    const requestDto: CreateLeaveRequestDto = {
      type: Number(formValue.type),
      startDate: formValue.startDate as string,
      endDate: formValue.endDate as string,
      reason: formValue.reason ? formValue.reason : null
    }

    this.leaveRequestService.createLeaveRequest(requestDto).subscribe({
      next: () => {
        this.toast.success("Successfully created the request!", 'Success');
        this.router.navigate(['/app/dashboard']);
      },

      error: (err) => {
        this.errors = [];
          if(err.status === 0){
            this.toast.error("Failed to connect to the server!", 'Network Error');
            this.errors.push('Failed to connect to the server!');
            return;
          } 
          this.toast.error("Couldn't create the request!", 'Error');

          if(!err.error){
            return;
          }
          this.errors = err.error;
      }
    })
  }
}
