import {WorkingDayInfo} from "./working-day-info.model";

export interface WorkingCalendarInfo {
  id: number;
  workingDays: WorkingDayInfo[];
}
