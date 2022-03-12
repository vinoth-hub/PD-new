import { TestBed } from '@angular/core/testing';

import { PowerSearchService } from './power-search.service';

describe('PowerSearchService', () => {
  let service: PowerSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
