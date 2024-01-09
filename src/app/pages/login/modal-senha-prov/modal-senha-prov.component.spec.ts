import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSenhaProvComponent } from './modal-senha-prov.component';

describe('ModalSenhaProvComponent', () => {
  let component: ModalSenhaProvComponent;
  let fixture: ComponentFixture<ModalSenhaProvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSenhaProvComponent]
    });
    fixture = TestBed.createComponent(ModalSenhaProvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
