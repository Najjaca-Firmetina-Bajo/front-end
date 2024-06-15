import {EquipmentInfo} from "./equipment-info.model";
import {RecipientInfo} from "./recipient-info.model";

export interface ContractInfo {
  id: number;
  quantity: number;
  pickupDate: Date;
  status: string;
  equipmentInfoDto: EquipmentInfo;
  recipientInfoDto: RecipientInfo;
}
