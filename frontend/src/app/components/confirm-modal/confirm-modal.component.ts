import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent{
  @Input() title: string = 'Are you sure?';
  @Input() message: string = "This action cannot be undone."
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel(){
    this.cancel.emit();
  }

  onConfirm(){
    this.confirm.emit();
  }
}
