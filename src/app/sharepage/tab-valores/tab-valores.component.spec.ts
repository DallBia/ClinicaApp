import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabValoresComponent } from './tab-valores.component';

describe('TabValoresComponent', () => {
  let component: TabValoresComponent;
  let fixture: ComponentFixture<TabValoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabValoresComponent]
    });
    fixture = TestBed.createComponent(TabValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
