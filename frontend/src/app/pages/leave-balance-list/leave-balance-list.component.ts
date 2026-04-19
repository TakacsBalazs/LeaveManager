import { Component, OnInit } from '@angular/core';
import { LeaveBalanceService } from '../../core/services/leave-balance.service';
import { LeaveBalanceResponse } from '../../models/leave';

@Component({
  selector: 'app-leave-balance-list',
  imports: [],
  templateUrl: './leave-balance-list.component.html',
  styleUrl: './leave-balance-list.component.scss'
})
export class LeaveBalanceListComponent implements OnInit{
  data: LeaveBalanceResponse[] = [];
  isLoading = true;


  constructor(private leaveBalanceService: LeaveBalanceService) {}

  ngOnInit(): void {
    this.leaveBalanceService.getAllLeaveBalances().subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      }
    })
  }
}
