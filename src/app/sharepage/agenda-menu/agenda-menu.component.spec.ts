import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaMenuComponent } from './agenda-menu.component';

describe('AgendaMenuComponent', () => {
  let component: AgendaMenuComponent;
  let fixture: ComponentFixture<AgendaMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendaMenuComponent]
    });
    fixture = TestBed.createComponent(AgendaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
