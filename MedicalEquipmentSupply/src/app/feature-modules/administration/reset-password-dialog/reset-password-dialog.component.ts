import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ResetPassword} from "../model/reset-password.model";
import {AuthService} from "../../../infrastructure/auth/auth.service";
import {AdministrationService} from "../administration.service";
import {AdminInfo} from "../model/admin-info.model";

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css']
})
export class ResetPasswordDialogComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    private administrationService: AdministrationService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmationNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      const confirmationNewPassword = this.resetPasswordForm.value.confirmationNewPassword;
      if (newPassword !== confirmationNewPassword) {
        // Ako se ne podudaraju, prikazujemo poruku o grešci
        // @ts-ignore
        this.resetPasswordForm.get('confirmationNewPassword').setErrors({ 'passwordMismatch': true });
        return;
      }

      const resetPasswordData: ResetPassword = {
        id: this.data,
        oldPassword: this.resetPasswordForm.value.oldPassword,
        newPassword: this.resetPasswordForm.value.newPassword,
        confirmationNewPassword: this.resetPasswordForm.value.confirmationNewPassword
      };

      // Ovde možete manipulisati podacima pre slanja na server
      console.log(resetPasswordData);

      // Pozivamo metodu changePassword iz AuthService
      this.administrationService.resetAdminPassword(resetPasswordData)
        .subscribe(
          (result) => {
            console.log('Password successfully changed:', result);

            // Nakon uspešne promene lozinke, izvršavamo odjavljivanje korisnika
            this.authService.logout();

            // Zatvaramo dijalog
            this.dialogRef.close(resetPasswordData);
          },
          (error) => {
            console.error('Error changing password:', error);

            if (error.error && error.error.message) {
              // Ako server vraća poruku o grešci, prikaži je korisniku
              alert(error.error.message);
            } else {
              // Ako server ne vraća poruku o grešci, prikaži generičku poruku
              alert('An error occurred while changing password. Please try again.');
            }
          }
        );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
