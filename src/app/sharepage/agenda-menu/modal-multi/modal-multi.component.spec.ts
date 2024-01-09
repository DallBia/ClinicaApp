import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMultiComponent } from './modal-multi.component';

describe('ModalMultiComponent', () => {
  let component: ModalMultiComponent;
  let fixture: ComponentFixture<ModalMultiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalMultiComponent]
    });
    fixture = TestBed.createComponent(ModalMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
