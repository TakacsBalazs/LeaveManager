import { Component, OnInit } from '@angular/core';
import { LeaveBalanceService } from '../../core/services/leave-balance.service';
import { CreateLeaveBalanceRequest, LeaveBalanceResponse, UpdateLeaveBalanceRequest } from '../../models/leave';
import { LeaveBalanceFormComponent } from '../../components/leave-balance-form/leave-balance-form.component';
import { UserService } from '../../core/services/user.service';
import { UserDropdown } from '../../models/user';

@Component({
  selector: 'app-leave-balance-list',
  imports: [LeaveBalanceFormComponent],
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

  constructor(private leaveBalanceService: LeaveBalanceService, private userService: UserService) {}

  ngOnInit(): void {
    this.leaveBalanceService.getAllLeaveBalances().subscribe({
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
        },
        error: (err) => {
          this.errors = err.error;
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
        },
        error: (err) => {
          this.errors = err.error;
        }
      });
    }
  }
}
