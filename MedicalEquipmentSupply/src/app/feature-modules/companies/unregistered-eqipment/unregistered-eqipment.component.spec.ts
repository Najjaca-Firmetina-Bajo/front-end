import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredEqipmentComponent } from './unregistered-eqipment.component';

describe('UnregisteredEqipmentComponent', () => {
  let component: UnregisteredEqipmentComponent;
  let fixture: ComponentFixture<UnregisteredEqipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnregisteredEqipmentComponent]
    });
    fixture = TestBed.createComponent(UnregisteredEqipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
