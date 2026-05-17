import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationResponse } from '../../models/notification';

@Component({
  selector: 'app-notification-modal',
  imports: [],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.scss'
})
export class NotificationModalComponent {
  @Input() notification: NotificationResponse | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteNotification = new EventEmitter<number>();

  onClose(){
    this.closeModal.emit();
  }

  onDelete(){
    this.deleteNotification.emit(this.notification!.id);
  }
}
