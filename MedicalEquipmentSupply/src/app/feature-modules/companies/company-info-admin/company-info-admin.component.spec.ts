import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInfoAdminComponent } from './company-info-admin.component';

describe('CompanyInfoAdminComponent', () => {
  let component: CompanyInfoAdminComponent;
  let fixture: ComponentFixture<CompanyInfoAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyInfoAdminComponent]
    });
    fixture = TestBed.createComponent(CompanyInfoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
