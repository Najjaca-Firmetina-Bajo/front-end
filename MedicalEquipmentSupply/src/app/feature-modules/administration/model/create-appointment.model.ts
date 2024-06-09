export interface CreateAppointment {
  adminId: number;
  pickUpDate: string;
  duration: number;
  workingDayId: number | null;
}
