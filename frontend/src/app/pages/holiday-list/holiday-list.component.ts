import { Component, OnInit } from '@angular/core';
import { CreateHolidayRequest, HolidayResponse } from '../../models/holiday';
import { HolidayService } from '../../core/services/holiday.service';
import { ToastrService } from 'ngx-toastr';
import { HolidayFormComponent } from '../../components/holiday-form/holiday-form.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-holiday-list',
  imports: [HolidayFormComponent, ConfirmModalComponent],
  templateUrl: './holiday-list.component.html',
  styleUrl: './holiday-list.component.scss'
})
export class HolidayListComponent implements OnInit{
  data: HolidayResponse[] = [];
  isLoading = true;
  isModalOpen = false;
  errors: string[] = [];

  constructor(private holidayService: HolidayService, private toast: ToastrService){}

  ngOnInit(): void {
    this.holidayService.getAllHolidays().subscribe({
      next: (resp) => {
        this.data = resp;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openModal(){
    this.errors = [];
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }

  handleCreateHoliday(formData: CreateHolidayRequest){
    this.holidayService.createHoliday(formData).subscribe({
      next: (resp) => {
        this.data.push(resp);
        this.closeModal();
        this.toast.success("Successfully created the holiday!", 'Success');
      },
      error: (err) => {
        this.errors = err.error;
        this.toast.error("Couldn't create the holiday!", 'Error');
      }
    });
  }
}
