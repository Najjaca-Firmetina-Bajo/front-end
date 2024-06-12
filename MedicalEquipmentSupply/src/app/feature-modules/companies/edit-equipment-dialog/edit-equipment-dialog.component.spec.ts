import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEquipmentDialogComponent } from './edit-equipment-dialog.component';

describe('EditEquipmentDialogComponent', () => {
  let component: EditEquipmentDialogComponent;
  let fixture: ComponentFixture<EditEquipmentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEquipmentDialogComponent]
    });
    fixture = TestBed.createComponent(EditEquipmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
