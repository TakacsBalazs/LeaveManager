import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../core/services/leave.service';
import { LeaveRequestDto } from '../../models/leave';
import { RouterLink } from "@angular/router";
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-my-requests',
  imports: [RouterLink, ConfirmModalComponent],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent implements OnInit{

  data: LeaveRequestDto[] = [];
  isLoading = true;
  isConfirmOpen = false;
  idToCancel: number | null = null;

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveService.getMyLeaveRequests().subscribe({
      next: (data) => {
        this.data = data;
        this.isLoading = false;
      }
    });
  }

  cancelTheRequest(){
    if(!this.idToCancel){
      return;
    }
    this.leaveService.cancelTheRequests(this.idToCancel).subscribe({
      next: () => {
        const requestToUpdate = this.data.find(x => x.id === this.idToCancel);
        if(requestToUpdate){
          requestToUpdate.status = 'Cancelled';
        }
        this.idToCancel = null;
        this.isConfirmOpen = false;
      }
    })
  }

  openConfirm(id: number){
    this.idToCancel = id;
    this.isConfirmOpen = true;
  }
}
