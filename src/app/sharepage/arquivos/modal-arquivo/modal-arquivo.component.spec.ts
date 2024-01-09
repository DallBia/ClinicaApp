import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalArquivoComponent } from './modal-arquivo.component';

describe('ModalArquivoComponent', () => {
  let component: ModalArquivoComponent;
  let fixture: ComponentFixture<ModalArquivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalArquivoComponent]
    });
    fixture = TestBed.createComponent(ModalArquivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
