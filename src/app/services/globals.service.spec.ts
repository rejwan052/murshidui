import { TestBed } from '@angular/core/testing';

import { Globals } from './globals.service';

describe('GlobalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [Globals]
  }));

  it('should be created', () => {
    const service: Globals = TestBed.get(Globals);
    expect(service).toBeTruthy();
  });
});
