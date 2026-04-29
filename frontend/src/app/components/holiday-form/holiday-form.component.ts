import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateHolidayRequest } from '../../models/holiday';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-holiday-form',
  imports: [ReactiveFormsModule],
  templateUrl: './holiday-form.component.html',
  styleUrl: './holiday-form.component.scss'
})
export class HolidayFormComponent implements OnInit{
  @Input() errors: string[] = [];
  @Output() saveForm = new EventEmitter<CreateHolidayRequest>();
  @Output() closeForm = new EventEmitter<void>();

  holidaysForm!: FormGroup;

  ngOnInit(): void {
    this.holidaysForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      date: new FormControl('', [Validators.required])
    });
  }

  onSubmit(){
    if(this.holidaysForm.valid){
      this.saveForm.emit(this.holidaysForm.value);
    }
  }

  onCancel(){
    this.closeForm.emit();
  }
}
