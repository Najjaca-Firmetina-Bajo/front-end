import { Component } from '@angular/core';
import { Equipment } from '../../administration/model/equipment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../companies.service';
import { Company } from '../../administration/model/comapny.model';

@Component({
  selector: 'app-unregistered-eqipment',
  templateUrl: './unregistered-eqipment.component.html',
  styleUrls: ['./unregistered-eqipment.component.css']
})
export class UnregisteredEqipmentComponent {
  companyId: number;
  company: any;
  filteredEquipment: any;
  selectedEquipmentMap: Map<number, boolean> = new Map<number, boolean>();

  constructor(private route: ActivatedRoute,private companyService: CompaniesService,private router: Router) {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.company = this.loadCompanies();
  }

  private loadCompanies(): void {
    this.companyService.getCompanyById(this.companyId).subscribe(
      (data: Company) => {
        this.company = data;
        console.log(this.company);
      },
      error => {
        console.error('Error fetching company data:', error);
      }
    );
  }

  private loadEquipmentByCompanyId(): void {
    if(this.companyId){
      this.companyService.getAllEquipment().subscribe((data) => {
        this.filteredEquipment = data.filter(equipment => equipment.companies.includes(this.companyId));
      });
    }
  }




  toggleEquipmentSelection(equipment: Equipment): void {
    const equipmentId = equipment.id;
    
    if (this.selectedEquipmentMap.has(equipmentId)) {
      this.selectedEquipmentMap.delete(equipmentId);
    } else {
      this.selectedEquipmentMap.set(equipmentId, true);
    }
  }
  
  getIsSelected(equipment: Equipment): boolean {
    return this.selectedEquipmentMap.has(equipment.id);
  }

  

}
