import { Component, OnInit } from '@angular/core';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { LeaveRequestDto } from '../../models/leave-request';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { ToastrService } from 'ngx-toastr';

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
  errors: string[] | null = null;

  constructor(private leaveRequestService: LeaveRequestService, private route: ActivatedRoute, private router: Router, private location: Location, private authService: AuthService, private toast: ToastrService) {}

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

    this.leaveRequestService.getRequestById(this.id).subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      }
    })
  }

  cancelTheRequest(){
    this.leaveRequestService.cancelTheRequests(this.id).subscribe({
      next: () => {
        this.data!.status = 'Cancelled';
        this.isCancelConfirmOpen = false;
        this.toast.success("Successfully cancelled the request!", 'Success');
      },
      error: () => {
        this.toast.error("An unexpected error!", 'Error')
      }
    })
  }

  goBack(){
    this.location.back();
  }

  onReject(){
    this.leaveRequestService.rejectRequest(this.id).subscribe({
      next: () => {
        this.data!.status = 'Rejected';
        this.toast.success("Successfully rejected the request!", 'Success');
      },
      error: (err) => {
        this.errors = [];
        if(err.status === 0){
          this.toast.error("Failed to connect to the server!", 'Network Error');
          this.errors.push('Failed to connect to the server!');
          return;
        } 
        this.toast.error("Couldn't reject the request!", 'Error');

        if(!err.error){
          return;
        }
        this.errors = err.error;
      }
    })
  }

  onApprove(){
    this.leaveRequestService.approveRequest(this.id).subscribe({
      next: () => {
        this.data!.status = 'Approved';
        this.toast.success("Successfully approved the request!", 'Success');
      },
      error: (err) => {
        this.errors = [];
        if(err.status === 0){
          this.toast.error("Failed to connect to the server!", 'Network Error');
          this.errors.push('Failed to connect to the server!');
          return;
        } 
        this.toast.error("Couldn't approve the request!", 'Error');

        if(!err.error){
          return;
        }
        this.errors = err.error;
      }
    })
  }

  openConfirmModal(){
    this.isCancelConfirmOpen = true;
  }
}
