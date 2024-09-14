import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent {
  newPassword: string = '';

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) { }

  resetPassword() {
    const resetData = {
      email: this.data.email,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        alert('Password reset successfully.');
        this.dialogRef.close();
      },
      error: (error) => {
        alert('Failed to reset password: ' + error.error.message);
      }
    });
  }
}
