import { Component, OnInit } from '@angular/core';
import { HolidayResponse } from '../../models/holiday';
import { HolidayService } from '../../core/services/holiday.service';
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

  constructor(private holidayService: HolidayService){}

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
}
