export interface ReservationInfo {
  id: number;
  appointmentId: number;
  qrCodeId: number;
  status: string;
  pickUpDate: Date;
  equipmentId: number;
  equipmentName: string;
  quantity: number;
  recipientId: number | null;
  recipientUsername: string;
  recipientName: string;
  recipientSurname: string;
}
