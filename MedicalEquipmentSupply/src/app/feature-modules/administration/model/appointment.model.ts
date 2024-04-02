import { Equipment } from "./equipment.model";
import { ReservedEquipmentItem } from "./qrcode.model";

export enum AppointmentType {
    Predefined = 0,
    Extraordinary = 1
}

export interface Appointment {
    id: number;
    duration: number;
    isDownloaded: boolean;
    pickUpDate: Date;
    reservationNumber: number;
    type: AppointmentType;
    reservedEquipmentIds: number[];
    companyAdministratorId: number;
    workingDayId: number;
    registredUserId: number;
    reservedEquipment: ReservedEquipmentItem[];
    reservedEquipmentReal: Equipment[];
  }
  