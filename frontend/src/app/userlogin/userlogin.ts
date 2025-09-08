import { Component, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OfficialService } from '../officials/official-service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-userlogin',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './userlogin.html',
  styleUrl: './userlogin.css',
})
export class Userlogin {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  submitted = false; // ✅ Track if login button clicked

  constructor(
    private fb: FormBuilder,
    private officialService: OfficialService,
    private router: Router,
  ) {
    this.createLoginForm();
  }
  forgetPassword() {}

  /** Initialize the form */
  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.officialService.checkLogin(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('returned');
        this.loading = false;
        localStorage.setItem('token', res.token);
        console.log(res);
        //const payload = JSON.parse(atob(res.token.split('.')[1]));
        //  localStorage.setItem('userId', payload.userId);
        this.router.navigate(['/branches']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error.message || 'Login failed';
        alert(this.errorMessage);
      },
    });
  }
}
