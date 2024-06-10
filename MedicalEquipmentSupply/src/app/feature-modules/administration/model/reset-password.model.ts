export interface ResetPassword {
  id: number
  oldPassword: string;
  newPassword: string;
  confirmationNewPassword: string;
}
