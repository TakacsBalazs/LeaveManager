import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateLeaveBalanceRequest, LeaveBalanceResponse } from '../../models/leave-balance';
import { UserDropdown } from '../../models/user';

@Component({
  selector: 'app-leave-balance-form',
  imports: [ReactiveFormsModule],
  templateUrl: './leave-balance-form.component.html',
  styleUrl: './leave-balance-form.component.scss'
})
export class LeaveBalanceFormComponent implements OnInit{
  @Input() leaveBalance: LeaveBalanceResponse | null = null;
  @Input() errors: string[] = [];
  @Input() users: UserDropdown[] = [];
  @Output() closeForm = new EventEmitter<void>();
  @Output() saveForm = new EventEmitter<CreateLeaveBalanceRequest>();

  leaveBalanceForm!: FormGroup;

  ngOnInit(): void {
    this.leaveBalanceForm = new FormGroup({
      userId: new FormControl('', this.leaveBalance ? [] : [Validators.required]),
      year: new FormControl('', this.leaveBalance ? [] : [Validators.required]),
      type: new FormControl(0, this.leaveBalance ? [] : [Validators.required]),
      totalDays: new FormControl(this.leaveBalance?.totalDays || '', this.leaveBalance ? [] : [Validators.required]),
      usedDays: new FormControl('', this.leaveBalance ? [] : [Validators.required])
    });
  }

  onSubmit(){
    if(this.leaveBalanceForm.valid){
      this.saveForm.emit(this.leaveBalanceForm.value);
    }
  }

  onCancel(){
    this.closeForm.emit();
  }
}
