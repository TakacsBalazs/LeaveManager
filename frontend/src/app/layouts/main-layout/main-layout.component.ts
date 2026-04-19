import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordFormComponent } from "../../components/change-password-form/change-password-form.component";
import { ChangePasswordRequest } from '../../models/auth';

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

  isAdminDropdownOpen = false;
  isProfileDropdownOpen = false;
  isMainMenuDropdownOpen = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
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
      },
      error: (err) => {
        this.errors = err.error;
      }
    })
  }

  toggleMainMenuDropdown() {
    this.isMainMenuDropdownOpen = !this.isMainMenuDropdownOpen;
    this.isAdminDropdownOpen = false;
    this.isProfileDropdownOpen = false;
  }

  toggleAdminDropdown() {
    this.isAdminDropdownOpen = !this.isAdminDropdownOpen;
    this.isProfileDropdownOpen = false; 
    this.isMainMenuDropdownOpen = false;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    this.isMainMenuDropdownOpen = false;
    this.isAdminDropdownOpen = false;
  }

}
