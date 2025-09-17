import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserLoginService } from './userloginservice';
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
    private userLoginService: UserLoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
    this.userLoginService.checkLogin(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('token', res.token);
        console.log('result ', res);
        localStorage.setItem('roleId', res.user.roleId.toString());
        localStorage.setItem('deptId', res.user.deptId.toString());
        localStorage.setItem('officialId', res.user.officialId);
        this.router.navigate(['/branches']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error.message || 'Login failed';
        alert(this.errorMessage);
        this.cdr.detectChanges();
      },
    });
  }
}
