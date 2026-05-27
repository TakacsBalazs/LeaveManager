import { Component, OnInit } from '@angular/core';
import { DashboardDto } from '../../models/dashboard';
import { DashboardService } from '../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  data: DashboardDto | null = null;
  isLoading = true;

  constructor(private dashboardService: DashboardService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('There was an error loading the data. Please try again later.', 'Error');
      }
    });
  }
}
