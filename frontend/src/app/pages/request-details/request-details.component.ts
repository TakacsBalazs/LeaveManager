import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../core/services/leave.service';
import { LeaveRequestDto } from '../../models/leave';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-request-details',
  imports: [ConfirmModalComponent],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss'
})
export class RequestDetailsComponent implements OnInit{

  data: LeaveRequestDto | null = null;
  isLoading = true;
  id!: number;
  isManagerMode = false;
  isCancelConfirmOpen = false;

  constructor(private leaveService: LeaveService, private route: ActivatedRoute, private router: Router, private location: Location, private authService: AuthService) {}

  ngOnInit(): void{
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){

      this.id = Number(idParam);
      if(isNaN(this.id) ||this.id <= 0){
        this.router.navigate(['dashboard']);
        return;
      }
    }

    if(this.authService.isAdmin()){
      this.isManagerMode = true;
    }

    this.leaveService.getRequestById(this.id).subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      }
    })
  }

  cancelTheRequest(){
    this.leaveService.cancelTheRequests(this.id).subscribe({
      next: () => {
        this.data!.status = 'Cancelled';
        this.isCancelConfirmOpen = false;
      }
    })
  }

  goBack(){
    this.location.back();
  }

  onReject(){
    this.leaveService.rejectRequest(this.id).subscribe({
      next: () => {
        this.data!.status = 'Rejected';
      }
    })
  }

  onApprove(){
    this.leaveService.approveRequest(this.id).subscribe({
      next: () => {
        this.data!.status = 'Approved';
      }
    })
  }

  openConfirmModal(){
    this.isCancelConfirmOpen = true;
  }
}
