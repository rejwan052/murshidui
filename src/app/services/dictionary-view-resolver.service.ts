import {Injectable} from '@angular/core';
import {SongModel} from '../models/SongModel';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SongsService} from './songs.service';
import {Observable} from 'rxjs';
import {DictionaryView} from '../models/DictionaryView';
import {DictionaryService} from './dictionary.service';
import {DictionariesAndSongs} from '../models/DictionariesAndSongs';


@Injectable()
export class DictionaryViewResolver implements Resolve<DictionariesAndSongs> {

  constructor(private backend: DictionaryService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<DictionariesAndSongs> | Promise<DictionariesAndSongs> | DictionariesAndSongs {
    return this.backend.searchWord(route.params.word);
  }
}
