import { TestBed } from '@angular/core/testing';

import { TellerService } from './teller.service';

describe('TellerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TellerService = TestBed.get(TellerService);
    expect(service).toBeTruthy();
  });
});
