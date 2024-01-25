import { Component, OnInit } from '@angular/core';
import { Equipment } from '../../model/equipment.model';
import { AdministrationService } from '../../administration.service';
import { Company } from '../../model/comapny.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CompanyAdministrator } from '../../model/company-administrator.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-review',
  templateUrl: './equipment-review.component.html',
  styleUrls: ['./equipment-review.component.css']
})
export class EquipmentReviewComponent implements OnInit{

  isCompanyAdmin: boolean = false
  companyAdmins: CompanyAdministrator[] = []
  equipment: Equipment[] = []
  unadjustedList: { name: string, type: string, price: number, description: string, companies: string[], cids: number[] }[] = []
  bindingList: { name: string, type: string, price: number, description: string, companies: string[], cids: number[] }[] = [] 
  allCompanies: Company[] = []
  search: string = ''
  filterType: string = ''
  filterMinPrice: number = 0
  filterMaxPrice: number = 0
  parameters: string = ''
  filter: boolean = false

  constructor (private administrationService: AdministrationService,
               private router: Router,
               private authService: AuthService) {}

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
          this.fillUnadjustedList()
      },
      error: () => { }
    });
  }

  fillUnadjustedList(): void {
    let flag = false;

    this.equipment.forEach(e => {
      if(e.companies.length !== 0) {
        let item: { name: string, type: string, price: number, description: string, companies: string[], cids: number[] } = {
          name: '',
          type: '',
          price: -1,
          description: '',
          companies: [],
          cids: []
        }
        e.companies.forEach(cid => {
          this.allCompanies.forEach(c => {
            if(cid === c.id) {
              item.name = e.name
              item.type = e.type
              item.price = e.price
              item.description = e.description
              item.companies.push(c.name)
              item.cids.push(c.id)
            }
          })
        })
        this.unadjustedList.push(item)
      }

      if(this.equipment[this.equipment.length-1].id === e.id) {
        flag = true;
      }
      
    })

    if(flag) {
      this.getAllCompanyAdministrators();
    }
  }
  
  getAllCompanyAdministrators(): void {
    this.administrationService.getAllCompanyAdministrators().subscribe({
      next: (result: CompanyAdministrator[]) => {
          this.companyAdmins = result;
          this.getLoggedUser();
      },
      error: () => { }
    });
  }

  getLoggedUser(): void {
    this.authService.getAuthenticatedUserId().subscribe({
      next: (result: number) => {
          this.adjustToComapnyAdmin(result);
      },
      error: () => { }
    });
  }

  adjustToComapnyAdmin(userId: number): void {
    let flag = false;
    
    this.companyAdmins.forEach(ca => {
      //console.log("prije if " + ca.id)
      if(ca.id === userId) {
        //console.log("adjustToComapnyAdmin")
        this.isCompanyAdmin = true;
        this.unadjustedList.forEach(e => {
          if(e.cids.includes(ca.companyId)) {
            this.bindingList.push(e);
          }
        })
      }

      if(this.companyAdmins[this.companyAdmins.length-1].id === ca.id) {
        //console.log(this.companyAdmins[this.companyAdmins.length-1].id + " " + ca.id)
        //console.log("flag")
        flag = true;
      }
    })  

    if(flag) {
      this.completeBindingList();
    }
  }

  backToPerviousPage(): void {
    this.router.navigate(['/companies']); 
  }

  completeBindingList(): void {
    if(!this.isCompanyAdmin) {
      //console.log("completeBindingList")
      this.unadjustedList.forEach(e => {
        this.bindingList.push(e);
      })
    }
  }

  resetBindingList(): void {
    this.filter = false
    this.filterType = ''
    this.filterMinPrice = 0
    this.filterMaxPrice = 0
    this.search = ''
    this.bindingList.length = 0
    this.unadjustedList.length = 0
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
          this.unadjustedList.length = 0
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
          this.unadjustedList.length = 0
          this.equipment = result
          this.getCompanies()
      },
      error: () => { }
    });
  }
}
