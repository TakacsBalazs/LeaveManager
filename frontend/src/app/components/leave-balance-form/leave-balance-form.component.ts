import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    const minYear = new Date().getFullYear();
    this.leaveBalanceForm = new FormGroup({
      userId: new FormControl('', this.leaveBalance ? [] : [Validators.required]),
      year: new FormControl('', this.leaveBalance ? [] : [Validators.required, Validators.min(minYear)]),
      type: new FormControl(0, this.leaveBalance ? [] : [Validators.required]),
      totalDays: new FormControl(this.leaveBalance?.totalDays || '', [Validators.required, Validators.min(0)]),
      usedDays: new FormControl(this.leaveBalance?.usedDays || '', this.leaveBalance ? [] : [Validators.required, Validators.min(0)])
    }, { validators: this.daysRangeValidator });
  }

  daysRangeValidator(group: AbstractControl){
    const totalDays = group.get('totalDays')?.value;
    const usedDays = group.get('usedDays')?.value;

    if(usedDays > totalDays){
      return { daysRangeInvalid: true };
    }

    return null;
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
