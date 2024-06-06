export interface AppointmentInfo {
  id: number;
  pickUpDate: string;
  duration: number;
  type: string;
  reservationNumber: number;
  workingDayId: number;
  qrCodeId: number | null;
  downloaded: boolean;
}
