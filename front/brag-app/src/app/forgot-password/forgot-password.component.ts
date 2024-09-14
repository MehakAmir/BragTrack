import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  openResetPasswordDialog() {
    this.http.post<{ message: string }>('http://localhost:8080/user/forgotPassword', { email: this.email })
      .subscribe({
        next: (response) => {
          this.dialog.open(ResetPasswordDialogComponent, {
            data: { email: this.email }
          });
        },
        error: (error) => {
          alert('Email not found: ' + error.error.message);
        }
      });
  }
}
