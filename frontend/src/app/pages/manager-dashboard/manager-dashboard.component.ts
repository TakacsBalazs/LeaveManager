import { Component, OnInit } from '@angular/core';
import { LeaveRequestDto } from '../../models/leave-request';
import { LeaveRequestService } from '../../core/services/leave-request.service'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterLink],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit{

  data: LeaveRequestDto[] = [];
  isLoading = true;

  constructor(private leaveRequestService: LeaveRequestService){}

  ngOnInit(): void {
    this.leaveRequestService.getAllPendingRequests().subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      }
    })
  }

  onReject(id: number){
    this.leaveRequestService.rejectRequest(id).subscribe({
      next: () => {
        const rejectedRequestInd = this.data.findIndex(x => x.id === id);
        if(rejectedRequestInd !== -1){
          this.data.splice(rejectedRequestInd, 1);
        }
      }
    })
  }

  onApprove(id: number){
    this.leaveRequestService.approveRequest(id).subscribe({
      next: () => {
        const approvedRequestInd = this.data.findIndex(x => x.id === id);
        if(approvedRequestInd !== -1){
          this.data.splice(approvedRequestInd, 1);
        }
      }
    })
  }
}
