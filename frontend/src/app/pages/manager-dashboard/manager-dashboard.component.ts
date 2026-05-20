import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FilterLeaveRequestCalendar, LeaveRequestDto } from '../../models/leave-request';
import { LeaveRequestService } from '../../core/services/leave-request.service'; 
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { SignalrService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-manager-dashboard',
  imports: [RouterLink, FullCalendarModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit{

  data: LeaveRequestDto[] = [];
  isLoading = true;

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    height: 650,
    buttonText: {
      today: 'Today'
    },

    events: (fetchInfo, successCallback, failureCallback) => {

      const params: FilterLeaveRequestCalendar = {
        startDate: fetchInfo.startStr.split('T')[0],
        endDate: fetchInfo.endStr.split('T')[0]
      }

      this.leaveRequestService.getLeaveRequestCalendar(params).subscribe({
        next: (resp) => {
          const formattedEvents = resp.map(leave => ({
            id: leave.id.toString(),
            title: leave.requesterName,
            start: leave.startDate,
            end: leave.endDate,
            color: this.getEventColor(leave.status, leave.type)
          }));
          successCallback(formattedEvents);
        },
        error: (err) => failureCallback(err)
      })
    },
  };

  getEventColor(status: string, type: string): string {
    if (status === 'Pending') {
      return 'orange';
    } else if (status === 'Approved') {
      switch (type) {
        case 'AnnualLeave':
          return 'green';
          
        case 'SickLeave':
          return 'red';
          
        case 'Unpaid':
          return 'blue';
      }
    }
  
    return 'gray';
  }

  constructor(private leaveRequestService: LeaveRequestService, private toast: ToastrService, private singnalr: SignalrService){}

  ngOnInit(): void {
    this.loadPendingRequest();

    this.singnalr.onLeaveRequestChanged((id, status) => {
      if(this.calendarComponent){
        this.calendarComponent.getApi().refetchEvents();
      }
      
      if(status === 'Approved' || status === 'Rejected' || status === 'Cancelled'){
        this.data = this.data.filter(x => x.id !== id);
      } else if(status === 'Pending'){
        this.loadPendingRequest();
      }
    })
  }

  loadPendingRequest(){
    this.leaveRequestService.getAllPendingRequests().subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('There was an error loading the data. Please try again later.', 'Error');
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
        this.toast.success("Successfully rejected the reqeust!", "Success");
      },
      error: () => {
        this.toast.error("Couldn't reject the request!", 'Error');
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
        this.toast.success("Successfully approved the reqeust!", "Success")
      },
      error: () => {
        this.toast.error("Couldn't approve the request!", 'Error');
      }
    })
  }
}
