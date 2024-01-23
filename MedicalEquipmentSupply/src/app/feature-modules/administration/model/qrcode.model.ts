export interface QRCodeDto {
    id: number;
    code: string;
    status: string;
    registeredUserId: number;
    appointmentId: number;
    reservedEquipmentIds: number[];
  }
  