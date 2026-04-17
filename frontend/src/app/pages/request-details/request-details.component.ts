import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../core/services/leave.service';
import { LeaveRequestDto } from '../../models/leave';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-request-details',
  imports: [],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss'
})
export class RequestDetailsComponent implements OnInit{

  data: LeaveRequestDto | null = null;
  isLoading = true;
  id!: number;

  constructor(private leaveService: LeaveService, private route: ActivatedRoute, private router: Router, private location: Location) {}

  ngOnInit(): void{
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){

      this.id = Number(idParam);
      if(isNaN(this.id) ||this.id <= 0){
        this.router.navigate(['dashboard']);
        return;
      }
    }

    this.leaveService.getRequestById(this.id).subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
        console.log(this.data)
      }
    })
  }

  cancelTheRequest(id: number){
    //check the confirm
    this.leaveService.cancelTheRequests(id).subscribe({
      next: () => {
        this.data!.status = 'Cancelled';
      }
    })
  }

  goBack(){
    this.location.back();
  }
}
