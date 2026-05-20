import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { NotificationResponse } from '../../models/notification';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection | undefined ;

  constructor(private authService: AuthService){
    this.authService.logoutEvent$.subscribe(() => {
      this.hubConnection?.stop();
    });
  }

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl('https://localhost:7171/leave-hub', {
      accessTokenFactory: () => localStorage.getItem('jwt_token') ?? ''
    }).withAutomaticReconnect().build();

    this.hubConnection.start()
  }

  public onNewNotification(callback: (newNotification: NotificationResponse) => void) {
    this.hubConnection?.on('ReceiveNotification', (notification) => {
      callback(notification);
    })
  }

  public onLeaveRequestChanged(callback: (id: number, status: string) => void){
    this.hubConnection?.on('LeaveRequestChanged', (id: number, status: string) => {
      callback(id, status);
    })
  }
}
