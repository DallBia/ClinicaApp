import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaCellComponent } from './agenda-cell.component';

describe('AgendaCellComponent', () => {
  let component: AgendaCellComponent;
  let fixture: ComponentFixture<AgendaCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaCellComponent]
    });
    fixture = TestBed.createComponent(AgendaCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
