import { TestBed } from '@angular/core/testing';

import { Vendorsservice } from './vendorsservice';

describe('Vendorsservice', () => {
  let service: Vendorsservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vendorsservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
