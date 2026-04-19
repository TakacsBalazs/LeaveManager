import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit{
  isAdmin = false;

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
