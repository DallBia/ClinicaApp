import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFinComponent } from './tab-fin.component';

describe('TabFinComponent', () => {
  let component: TabFinComponent;
  let fixture: ComponentFixture<TabFinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabFinComponent]
    });
    fixture = TestBed.createComponent(TabFinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
