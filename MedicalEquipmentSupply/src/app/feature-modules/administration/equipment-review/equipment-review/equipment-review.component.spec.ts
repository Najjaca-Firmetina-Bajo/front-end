import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentReviewComponent } from './equipment-review.component';

describe('EquipmentReviewComponent', () => {
  let component: EquipmentReviewComponent;
  let fixture: ComponentFixture<EquipmentReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmentReviewComponent]
    });
    fixture = TestBed.createComponent(EquipmentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
