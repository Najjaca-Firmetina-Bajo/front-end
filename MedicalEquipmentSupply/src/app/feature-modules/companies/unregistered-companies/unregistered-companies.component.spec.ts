import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredCompaniesComponent } from './unregistered-companies.component';

describe('UnregisteredCompaniesComponent', () => {
  let component: UnregisteredCompaniesComponent;
  let fixture: ComponentFixture<UnregisteredCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnregisteredCompaniesComponent]
    });
    fixture = TestBed.createComponent(UnregisteredCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
