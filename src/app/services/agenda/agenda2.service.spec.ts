import { TestBed } from '@angular/core/testing';

import { Agenda2Service } from './agenda2.service';

describe('Agenda2Service', () => {
  let service: Agenda2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Agenda2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
