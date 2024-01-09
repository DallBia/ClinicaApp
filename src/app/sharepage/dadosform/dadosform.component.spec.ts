import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosformComponent } from './dadosform.component';

describe('DadosformComponent', () => {
  let component: DadosformComponent;
  let fixture: ComponentFixture<DadosformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DadosformComponent]
    });
    fixture = TestBed.createComponent(DadosformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
