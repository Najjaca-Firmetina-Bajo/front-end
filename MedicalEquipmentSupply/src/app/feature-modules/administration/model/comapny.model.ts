
  export interface AvailableEquipment {
    equipmentId: number;
    quantity: number;
  }
  
  export interface Company {
    id: number;
    name: string;
    address: string;
    averageRating: number;
    availableEquipment: AvailableEquipment[];
    companyAdministratorIds: number[];
    workingCalendarId: number;
  }