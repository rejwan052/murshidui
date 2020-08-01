import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTagsComponent } from './all-tags/all-tags.component';
import { CoverComponent } from './cover/cover.component';
import { FooterComponent } from './footer/footer.component';
import { PagerComponent } from './cover/pager/pager.component';
import { SongSelectorItemComponent } from './cover/song-selector-item/song-selector-item.component';
import { DictionaryDefinitionComponent } from './song/dictionary-definition/dictionary-definition.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule, MatSelectModule
} from '@angular/material';
import { SongContainerComponent } from './song/song-container.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxYoutubePlayerModule} from 'ngx-youtube-player';
import {Globals} from './services/globals.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SongsService} from './services/songs.service';
import {SongModelResolver} from './services/song-model-resolver.service';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SelectorComponent } from './selector/selector.component';
import { SongplainComponent } from './songplain/songplain.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import {DictionaryViewResolver} from './services/dictionary-view-resolver.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    AllTagsComponent,
    CoverComponent,
    FooterComponent,
    PagerComponent,
    SongSelectorItemComponent,
    DictionaryDefinitionComponent,
    SongContainerComponent,
    MainNavComponent,
    SelectorComponent,
    SongplainComponent,
    DictionaryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    FormsModule,
    NgxYoutubePlayerModule,
    MatCheckboxModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [SongsService, SongModelResolver, DictionaryViewResolver],
  bootstrap: [AppComponent],
  entryComponents: [DictionaryDefinitionComponent]
})
export class AppModule { }
