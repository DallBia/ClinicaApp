import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeModalComponent } from './equipe-modal.component';

describe('EquipeModalComponent', () => {
  let component: EquipeModalComponent;
  let fixture: ComponentFixture<EquipeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipeModalComponent]
    });
    fixture = TestBed.createComponent(EquipeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
