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
  }
  