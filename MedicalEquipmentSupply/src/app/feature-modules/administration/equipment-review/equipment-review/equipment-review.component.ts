import { Component, OnInit } from '@angular/core';
import { Equipment } from '../../model/equipment.model';
import { AdministrationService } from '../../administration.service';
import { Company } from '../../model/comapny.model';

@Component({
  selector: 'app-equipment-review',
  templateUrl: './equipment-review.component.html',
  styleUrls: ['./equipment-review.component.css']
})
export class EquipmentReviewComponent implements OnInit{

  equipment: Equipment[] = []
  bindingList: { name: string, type: string, price: number, description: string, companies: string[] }[] = [] 
  allCompanies: Company[] = []
  search: string = ''
  filterType: string = ''
  filterMinPrice: number = 0
  filterMaxPrice: number = 0
  parameters: string = ''
  filter: boolean = false

  constructor (private administrationService: AdministrationService) {}

  ngOnInit(): void {
    this.getAllEquipment()
  }

  getAllEquipment(): void {
    this.administrationService.getAllEquipment().subscribe({
      next: (result: Equipment[]) => {
          this.equipment = result;
          this.getCompanies()
      },
      error: () => { }
   });
  }

  getCompanies(): void {
    this.administrationService.getAllCompanies().subscribe({
      next: (result: Company[]) => {
          this.allCompanies = result;
          this.fillBindingList()
      },
      error: () => { }
    });
  }

  fillBindingList(): void {
    this.equipment.forEach(e => {
      let item: { name: string, type: string, price: number, description: string, companies: string[] } = {
        name: '',
        type: '',
        price: -1,
        description: '',
        companies: []
      }
      e.companies.forEach(cid => {
        this.allCompanies.forEach(c => {
          if(cid === c.id) {
            item.name = e.name
            item.type = e.type
            item.price = e.price
            item.description = e.description
            item.companies.push(c.name)
          }
        })
      })
      this.bindingList.push(item)
    })
  }
  
  resetBindingList(): void {
    this.filter = false
    this.filterType = ''
    this.filterMinPrice = 0
    this.filterMaxPrice = 0
    this.search = ''
    this.bindingList.length = 0
    this.getAllEquipment()
  }

  searchEquipment(): void {
    this.administrationService.searchEquipment(this.search).subscribe({
      next: (result: Equipment[]) => {
          this.filter = true
          this.filterType = ''
          this.filterMinPrice = 0
          this.filterMaxPrice = 0
          this.bindingList.length = 0
          this.equipment = result
          this.getCompanies()
      },
      error: () => { }
    });
  }

  filterEquipment(): void {
    this.parameters = this.search + ',' + this.filterType + ',' + this.filterMinPrice + ',' + this.filterMaxPrice
    this.administrationService.filterEquipment(this.parameters).subscribe({
      next: (result: Equipment[]) => {
          this.bindingList.length = 0
          this.equipment = result
          this.getCompanies()
      },
      error: () => { }
    });
  }
}
