import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agenda2Component } from './agenda2.component';

describe('Agenda2Component', () => {
  let component: Agenda2Component;
  let fixture: ComponentFixture<Agenda2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Agenda2Component]
    });
    fixture = TestBed.createComponent(Agenda2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
