import { Component, computed, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordFormComponent } from "../../components/change-password-form/change-password-form.component";
import { ChangePasswordRequest } from '../../models/auth';
import { ToastrService } from 'ngx-toastr';
import { NotificationResponse } from '../../models/notification';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, ChangePasswordFormComponent],
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

  unreadNotificationsCount = computed(() => {
    return this.notifications().filter(x => !x.isRead).length;
  });

  constructor(private authService: AuthService, private router: Router, private toast: ToastrService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.notificationService.getUserAllNotification().subscribe({
      next: (resp) => {
        this.notifications.set(resp);
      }
    });
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
}
