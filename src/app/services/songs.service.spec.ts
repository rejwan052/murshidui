import { TestBed } from '@angular/core/testing';

import { SongsService } from './songs.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Globals} from './globals.service';

describe('SongsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SongsService, Globals],
    imports: [HttpClientTestingModule],
  }));

  it('should be created', () => {
    const service: SongsService = TestBed.get(SongsService);
    expect(service).toBeTruthy();
  });
});
