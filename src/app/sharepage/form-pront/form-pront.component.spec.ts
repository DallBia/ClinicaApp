import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProntComponent } from './form-pront.component';

describe('FormProntComponent', () => {
  let component: FormProntComponent;
  let fixture: ComponentFixture<FormProntComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormProntComponent]
    });
    fixture = TestBed.createComponent(FormProntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
