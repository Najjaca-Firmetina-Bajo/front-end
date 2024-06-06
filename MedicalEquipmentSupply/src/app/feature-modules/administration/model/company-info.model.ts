import {AppointmentInfo} from "./appointment-info.model";
import {AdminInfo} from "./admin-info.model";

export interface CompanyInfo {
  id: number;
  name: string;
  address: string;
  description: string;
  averageRating: number;
  availableAppointments: AppointmentInfo[];
  admins: AdminInfo[];
}
