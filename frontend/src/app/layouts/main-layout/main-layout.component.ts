import { Component, computed, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordFormComponent } from "../../components/change-password-form/change-password-form.component";
import { ChangePasswordRequest } from '../../models/auth';
import { ToastrService } from 'ngx-toastr';
import { NotificationResponse } from '../../models/notification';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationModalComponent } from '../../components/notification-modal/notification-modal.component';
import { SignalrService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, ChangePasswordFormComponent, NotificationModalComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit{
  isAdmin = false;
  isPasswordModalOpen = false;
  errors: string[] = [];
  notifications = signal<NotificationResponse[]>([]);

  isAdminDropdownOpen = false;
  isProfileDropdownOpen = false;
  isMainMenuDropdownOpen = false;
  isMobileMenuOpen = false;
  isNotificationDropdownOpen = false;

  isNotificationModalOpen = false;
  selectedNotification: NotificationResponse | null = null;

  unreadNotificationsCount = computed(() => {
    return this.notifications().filter(x => !x.isRead).length;
  });

  constructor(private authService: AuthService, private router: Router, private toast: ToastrService, private notificationService: NotificationService, private signalrService: SignalrService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.notificationService.getUserAllNotification().subscribe({
      next: (resp) => {
        this.notifications.set(resp);
      }
    });

    this.signalrService.startConnection();

    this.signalrService.onNewNotification((newNotification) => {

      this.notifications.update(currentArray => {
        return [newNotification, ...currentArray];
      });
    })
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  openPasswordModal(): void {
    this.errors = [];
    this.isPasswordModalOpen = true;
  }

  closePasswordModal(): void {
    this.isPasswordModalOpen = false;
  }

  changePassword(formData: ChangePasswordRequest){
    this.authService.changePassword(formData).subscribe({
      next: () => {
        this.closePasswordModal();
        this.router.navigate(['/login']);
        this.toast.success("Successfully changed the password!", 'Success');
      },
      error: (err) => {
        this.errors = err.error;
        this.toast.error("Couldn't change the password!", 'Error');
      }
    })
  }

  toggleMainMenuDropdown() {
    this.isMainMenuDropdownOpen = !this.isMainMenuDropdownOpen;
    this.isAdminDropdownOpen = false;
    this.isProfileDropdownOpen = false;
    this.isNotificationDropdownOpen = false;
  }

  toggleAdminDropdown() {
    this.isAdminDropdownOpen = !this.isAdminDropdownOpen;
    this.isProfileDropdownOpen = false; 
    this.isMainMenuDropdownOpen = false;
    this.isNotificationDropdownOpen = false;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    this.isMainMenuDropdownOpen = false;
    this.isAdminDropdownOpen = false;
    this.isNotificationDropdownOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleNotificationDropdown(){
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    this.isMainMenuDropdownOpen = false;
    this.isAdminDropdownOpen = false;
    this.isProfileDropdownOpen = false;
  }

  openNotificationModal(notification: NotificationResponse){
    this.isNotificationModalOpen = true;
    this.selectedNotification = notification;

    this.notificationService.getNotification(notification.id).subscribe({
      next: (resp) => {
        this.notifications.update(current => current.map(x => x.id === resp.id ? resp : x));
      }
    })
  }

  closeNotificationModal(){
    this.isNotificationModalOpen = false; 
    this.selectedNotification = null;
  }

  onDeleteNotification(id: number){
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications.update(current => current.filter(x => x.id !== id))
      }
    })
  }
}
