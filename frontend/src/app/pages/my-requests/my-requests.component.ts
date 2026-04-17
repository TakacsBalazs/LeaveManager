import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../core/services/leave.service';
import { LeaveRequestDto } from '../../models/leave';

@Component({
  selector: 'app-my-requests',
  imports: [],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent implements OnInit{

  data: LeaveRequestDto[] = [];
  isLoading = true;

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveService.getMyLeaveRequests().subscribe({
      next: (data) => {
        this.data = data;
        this.isLoading = false;
      }
    });
  }

  cancelTheRequest(id: number){
    //check the confirm
    this.leaveService.cancelTheRequets(id).subscribe({
      next: () => {
        const requestToUpdate = this.data.find(x => x.id === id);
        if(requestToUpdate){
          requestToUpdate.status = 'Cancelled';
        }
      }
    })
  }
}
