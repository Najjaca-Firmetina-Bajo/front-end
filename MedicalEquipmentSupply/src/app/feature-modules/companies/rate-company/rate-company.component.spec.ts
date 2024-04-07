import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCompanyComponent } from './rate-company.component';

describe('RateCompanyComponent', () => {
  let component: RateCompanyComponent;
  let fixture: ComponentFixture<RateCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateCompanyComponent]
    });
    fixture = TestBed.createComponent(RateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
