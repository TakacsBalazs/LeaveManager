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
  isConfirmOpen = false;
  idToDelete: number | null = null;

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

  openConfirm(id: number){
    this.idToDelete = id;
    this.isConfirmOpen = true;
  }

  onDelete(){
    if(!this.idToDelete){
      return;
    }

    this.holidayService.deleteHoliday(this.idToDelete).subscribe({
      next: () => {
        const holidayInd = this.data.findIndex(x => x.id == this.idToDelete);
        this.data.splice(holidayInd, 1);
        this.isConfirmOpen = false;
        this.idToDelete = null;
        this.toast.success("Successfully deleted the holiday!", 'Success');
      },
      error: () => {
        this.toast.error("Couldn't delete the holiday!", 'Error');
      }
    })
  }
}
