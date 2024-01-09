import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArquivosComponent } from './arquivos.component';

describe('ArquivosComponent', () => {
  let component: ArquivosComponent;
  let fixture: ComponentFixture<ArquivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArquivosComponent]
    });
    fixture = TestBed.createComponent(ArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
