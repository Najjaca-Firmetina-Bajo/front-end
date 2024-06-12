import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEquipmentDialogComponent } from './create-equipment-dialog.component';

describe('CreateEquipmentDialogComponent', () => {
  let component: CreateEquipmentDialogComponent;
  let fixture: ComponentFixture<CreateEquipmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEquipmentDialogComponent]
    });
    fixture = TestBed.createComponent(CreateEquipmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
