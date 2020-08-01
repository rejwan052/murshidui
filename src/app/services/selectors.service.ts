import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SelectorItem} from '../models/SelectorItem';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectorsService {

  private allItems: SelectorItem[];

  constructor(private http: HttpClient) {}

  async retrieveAllItems(): Promise<SelectorItem[]> {
    if (this.allItems === undefined || this.allItems.length === 0) {
      return this.http.get<SelectorItem[]>(environment.javaHost + '/murshid-api/selector/all', {})
        .pipe(
          catchError((err) => {
            console.error('error when calling /murshid-api/selector/all ' + err);
            return of([]);
          })
        )
        .toPromise()
        .then(result => this.allItems = result);
    } else {
      return this.allItems;
    }
  }

  selectBySubstring(substring: string): SelectorItem[] {
    if (typeof(this.allItems) === 'undefined') {
      return [];
    } else {
      return this.allItems.filter(i => i.title.indexOf(substring) >= 0);
    }
  }
}
