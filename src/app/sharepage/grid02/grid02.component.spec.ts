import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grid02Component } from './grid02.component';

describe('Grid02Component', () => {
  let component: Grid02Component;
  let fixture: ComponentFixture<Grid02Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Grid02Component]
    });
    fixture = TestBed.createComponent(Grid02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
