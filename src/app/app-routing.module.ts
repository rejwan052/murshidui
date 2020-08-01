import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SongContainerComponent} from './song/song-container.component';
import {SongModelResolver} from './services/song-model-resolver.service';
import {CoverComponent} from './cover/cover.component';
import {AllTagsComponent} from './all-tags/all-tags.component';
import {SongplainComponent} from './songplain/songplain.component';
import {DictionaryComponent} from './dictionary/dictionary.component';
import {DictionaryViewResolver} from './services/dictionary-view-resolver.service';
import {DictionariesAndSongs} from './models/DictionariesAndSongs';


const routes: Routes = [
  { path: 'all-tags', component: AllTagsComponent },

  { path: 'tag/:tag', component: CoverComponent},
  { path: 'tag/:tag/sort/:sort', component: CoverComponent},
  { path: 'tag/:tag/sort/:sort/:page', component: CoverComponent},
  { path: 'tag/:tag/:page', component: CoverComponent},
  { path: 'song/:script/:urlKey', component: SongContainerComponent, resolve: { songModel: SongModelResolver}},
  { path: 'song/:urlKey', component: SongContainerComponent, resolve: { songModel: SongModelResolver}},
  { path: 'song-lyrics/:script/:urlKey', component: SongplainComponent, resolve: { songModel: SongModelResolver}},
  { path: 'dictionary', component: DictionaryComponent, resolve: { dictionariesAndSongs: DictionaryViewResolver}},
  { path: 'dictionary/:word', component: DictionaryComponent, resolve: { dictionariesAndSongs: DictionaryViewResolver}},
  { path: ':page', component: CoverComponent },
  { path: 'sort/:sort', component: CoverComponent },
  { path: 'sort/:sort/:page', component: CoverComponent },
  { path: '', pathMatch: 'full', component: CoverComponent },

  // path: '**', redirectTo: 'Hindi/aaya-tere-dar-par', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,  {scrollPositionRestoration: 'enabled'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
