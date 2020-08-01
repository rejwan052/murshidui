import { TestBed } from '@angular/core/testing';
import {SongModelResolver} from './song-model-resolver.service';
import {SongsService} from './songs.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Globals} from './globals.service';



describe('SongModelResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SongsService, SongModelResolver, Globals],
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: SongModelResolver = TestBed.get(SongModelResolver);
    expect(service).toBeTruthy();
  });
});
