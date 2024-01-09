import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirComponent } from './modal-confir.component';

describe('ModalConfirComponent', () => {
  let component: ModalConfirComponent;
  let fixture: ComponentFixture<ModalConfirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirComponent]
    });
    fixture = TestBed.createComponent(ModalConfirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
