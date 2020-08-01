import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Tag} from '../models/Tag';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {SongModel} from '../models/SongModel';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  private tagMap: Map<String, Tag> = new Map<String, Tag>();

  constructor(private http: HttpClient) {
    console.log('constructing TagsService');
    this.http.get<Tag[]>(environment.javaHost + '/murshid-api/tags/allTags', {})
      .pipe(
        catchError((err) => {
          console.error('error when calling /murshid-api/tags/allTags in TagsService constructor ' + err);
          return of([]);
        })
      )
      .toPromise()
      .then(tags => tags.forEach(tag => this.tagMap.set(tag.key, tag))
      );
  }

  static simulateDescription(tagName: string): string {
    if (tagName === undefined) {
      return undefined;
    } else {
      let tokens = tagName.split('-');
      tokens = tokens.map(t => t.charAt(0).toUpperCase() + t.substr(1));
      return tokens.join(' ');
    }
  }

  retrieveAll(): Tag[] {
    return Array.from(this.tagMap.values());
  }

  /**
   * This calls a single, specific http directly when the tag URL is called directly, or tries
   * to use the existing map of tags when the page had flowed from somewhere else
   */
  async getTag(key: string): Promise<Tag> {
    const value = this.tagMap.get(key);
    if (value === undefined) {
      return this.http.get<Tag>(environment.javaHost + '/murshid-api/tags/tag',
        {
          params: {
            key
          }
        }).toPromise();
    } else {
      return value;
    }
  }
}
