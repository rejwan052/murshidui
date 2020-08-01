import {Injectable} from '@angular/core';
import {SongModel} from '../models/SongModel';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SongsService} from './songs.service';
import {Observable} from 'rxjs';


@Injectable()
export class SongModelResolver implements Resolve<SongModel> {

  constructor(private backend: SongsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SongModel> | Promise<SongModel> | SongModel {
    return this.backend.retrieveSong(route.params.urlKey, route.params.script);
  }
}
