import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  errors: string[] | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login(){
    if(this.loginForm.valid){
      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/app/dashboard'])
        },

        error: (err) => {
          this.errors = [];
          if(err.status === 0){
            this.errors.push('Failed to connect to the server!');
            return;
          } 

          this.errors = err.error;
    
        }
      });
    }
  }
}
