export interface QRCodeDto {
  id: number;
  code: string;
  status: string;
  registeredUserId: number;
  appointmentId: number;
  reservedEquipment: ReservedEquipmentItem[];
}

export interface ReservedEquipmentItem {
  equipmentId: number;
  quantity: number;
}
