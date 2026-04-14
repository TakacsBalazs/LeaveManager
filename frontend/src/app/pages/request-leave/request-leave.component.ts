import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateLeaveRequestDto } from '../../models/leave';
import { LeaveService } from '../../core/services/leave.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-leave',
  imports: [ReactiveFormsModule],
  templateUrl: './request-leave.component.html',
  styleUrl: './request-leave.component.scss'
})
export class RequestLeaveComponent {
  minDate: string;
  errors: string[] | null = null;
  constructor(private leaveService: LeaveService, private router: Router){
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

    this.leaveService.createLeaveRequest(requestDto).subscribe({
      next: () => {
        this.router.navigate(['/app/dashboard'])
      },

      error: (err) => {
        this.errors = [];
          if(err.status === 0){
            this.errors.push('Failed to connect to the server!');
            return;
          } 

          this.errors = err.error;
      }
    })
  }
}
