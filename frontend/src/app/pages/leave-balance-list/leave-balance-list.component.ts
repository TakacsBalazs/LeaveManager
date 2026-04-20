import { Component, OnInit } from '@angular/core';
import { LeaveBalanceService } from '../../core/services/leave-balance.service';
import { CreateLeaveBalanceRequest, LeaveBalanceResponse, FilterLeaveBalance, UpdateLeaveBalanceRequest } from '../../models/leave-balance';
import { LeaveBalanceFormComponent } from '../../components/leave-balance-form/leave-balance-form.component';
import { UserService } from '../../core/services/user.service';
import { UserDropdown } from '../../models/user';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-balance-list',
  imports: [LeaveBalanceFormComponent, ConfirmModalComponent, ReactiveFormsModule],
  templateUrl: './leave-balance-list.component.html',
  styleUrl: './leave-balance-list.component.scss'
})
export class LeaveBalanceListComponent implements OnInit{
  data: LeaveBalanceResponse[] = [];
  isLoading = true;
  isModalOpen = false;
  selectedLeaveBalance: LeaveBalanceResponse | null = null;
  errors: string[] = [];
  users: UserDropdown[] = [];
  isConfirmOpen = false;
  idToDelete: number | null = null;

  filterForm: FormGroup = new FormGroup({
    userFullname: new FormControl(''),
    year: new FormControl(''),
    type: new FormControl(0)
  })

  constructor(private leaveBalanceService: LeaveBalanceService, private userService: UserService) {}

  ngOnInit(): void {
    this.leaveBalanceService.getAllLeaveBalances(null).subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      }
    })
  }

  openCreateModal(): void {
    this.selectedLeaveBalance = null;
    this.errors = [];
    this.userService.getUsersForDropdown().subscribe({
      next: (resp) => {
        this.users = resp;
        this.isModalOpen = true;
      }
    })
  }

  openEditModal(leaveBalance: LeaveBalanceResponse): void {
    this.errors = [];
    this.selectedLeaveBalance = leaveBalance;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  handleLeaveBalance(formData: any){
    if(this.selectedLeaveBalance){
      const leaveBalance: UpdateLeaveBalanceRequest = {
        totalDays: formData.totalDays
      }
      this.leaveBalanceService.updateLeaveBalance(leaveBalance, this.selectedLeaveBalance.id).subscribe({
        next: (resp) => {
          const leaveBalanceInd = this.data.findIndex(x => x.id == this.selectedLeaveBalance!.id);
          this.data[leaveBalanceInd] = resp;
          this.closeModal();
          this.toast.success("Successfully edited the leave balance!", 'Success');
        },
        error: (err) => {
          this.errors = err.error;
          this.toast.error("Couldn't edit the leave balance!", 'Error');
        }
      })
    } else {
      const leaveBalance: CreateLeaveBalanceRequest = {
        userId: formData.userId,
        year: formData.year,
        type: formData.type,
        totalDays: formData.totalDays,
        usedDays: formData.usedDays
      }
      this.leaveBalanceService.createLeaveBalance(leaveBalance).subscribe({
        next: (resp) => {
          this.data.push(resp);
          this.closeModal();
          this.toast.success("Successfully created the leave balance!", 'Success');
        },
        error: (err) => {
          this.errors = err.error;
          this.toast.error("Couldn't create the leave balance!", 'Error');
        }
      });
    }
  }

  onDelete(){
    if(!this.idToDelete){
      return;
    }

    this.leaveBalanceService.deleteLeaveBalance(this.idToDelete).subscribe({
      next: () => {
        const leaveBalanceInd = this.data.findIndex(x => x.id == this.idToDelete);
        this.data.splice(leaveBalanceInd, 1);
        this.isConfirmOpen = false;
        this.idToDelete = null;
        this.toast.success("Successfully deleted the leave balance!", 'Success');
      },
      error: () => {
        this.toast.error("Couldn't delete the leave balance!", 'Error');
      }
    })
  }

  openConfirm(id: number){
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  onSubmitQuery(){
    const filter: FilterLeaveBalance = {
      userFullname: this.filterForm.value.userFullname,
      year: this.filterForm.value.year,
      type: this.filterForm.value.type,
    }

    this.leaveBalanceService.getAllLeaveBalances(filter).subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }
}
