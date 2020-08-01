import { Injectable } from '@angular/core';
import {SelectorItem} from '../models/SelectorItem';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DictionaryView} from '../models/DictionaryView';
import {DictionariesAndSongs} from '../models/DictionariesAndSongs';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient) { }

  async searchWord(word: string): Promise<DictionariesAndSongs> {
    return this.http.get<DictionariesAndSongs>(environment.javaHost + '/murshid-api/dictionaries/searchword',
      {
        params : {
          word
        }})
      .pipe(
        catchError((err) => {
          console.error('error when calling /murshid-api/dictionaries/searchword in DictionaryService,searchWOrd' + err);
          const dicAndSongs = new DictionariesAndSongs();
          dicAndSongs.song_selectors = [];
          dicAndSongs.dictionary_views = [];
          return of(dicAndSongs);
        })
      )
      .toPromise();
  }

}
