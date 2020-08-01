import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {Transliteration} from '../models/Transliteration';
import {SongModel} from '../models/SongModel';
import {ParagraphBlock} from '../models/ParagraphBlock';
import {ActivatedRoute, Router} from '@angular/router';
import {SongsService} from '../services/songs.service';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {Globals} from '../services/globals.service';
import {MatDialog} from '@angular/material';
import {isPlatformBrowser} from '@angular/common';
import {Section} from '../models/Section';
import {EnumUtils} from '../models/EnumUtils';
import {environment} from '../../environments/environment';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-songplain',
  templateUrl: './songplain.component.html',
  styleUrls: ['./songplain.component.scss']
})
export class SongplainComponent implements OnInit {

  private sub: any;
  public script: Transliteration;
  private urlKey: string;
  public songModel: SongModel;
  public isBrowser;
  public nastaliqCalligraphy: true;
  public plainHtml: string;

  public languageParagraphDir: string;
  public languageParagraphClass: string;
  public languagePunctuationClass: string;
  // the first time, the video doesn't seekTo() correctly
  // so cueVideo(... with a start seconds) has to be used instead
  private clickedOnce: boolean;

  public clickableDictionaryLink: string;


  constructor(private route: ActivatedRoute, private router: Router, private songsService: SongsService, private elementRef: ElementRef,
              private renderer: Renderer2, @Inject(PLATFORM_ID) private platformId, private changeDetector: ChangeDetectorRef,
              private title: Title, private meta: Meta, private globals: Globals, public dialog: MatDialog,
              private _sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.clickedOnce = false;
  }

  async ngOnInit() {
    this.globals.section = Section.Song;
    let attributeSelector  = 'name="description"';
    this.meta.removeTag(attributeSelector);
    attributeSelector  = 'name="og:image"';
    this.meta.removeTag(attributeSelector);

    this.sub = this.route.params.subscribe(params => {
      if (params.script !== undefined) {
        this.script = EnumUtils.transliterationFromString( params.script);
      } else {
        this.script = Transliteration.Hindi;
      }
      this.urlKey = params.urlKey;
      this.globals.urlKey = this.urlKey;
      this.globals.transliteration = this.script;
      this.songModel = this.route.snapshot.data.songModel;
      if (this.songModel != null) {
        this.title.setTitle(this.buildTitle(this.songModel, this.script));
        this.meta.updateTag({ name: 'description', content: this.buildDescription( this.songModel, this.globals.transliteration) });
        this.meta.updateTag({ name: 'og:image', content:  environment.imageServer + '/video-thumbnails/' + this.songModel.urlKey + environment.jpegExtension});
      }
      this.clickableDictionaryLink = '/song/' + Transliteration[this.globals.transliteration].toString() + '/' + this.globals.urlKey;
      this.updateContainerContent();

    });


    this.changeDetector.detectChanges();

    // ngOnInit is executed twice, one on the server, the other on the browser
    if (this.isBrowser) {
      fromEvent(window, 'resize')
        .pipe(debounceTime(500))
        .subscribe(() => this.onResize());
    }
  }

  changeTagItemStyle(evt: Event) {
    if (evt.type === 'mouseover') {
      $(evt.target).addClass('tag-item-hover');
    } else {
      $(evt.target).removeClass('tag-item-hover');
    }
  }

  buildTitle(songModel: SongModel, transliteration: Transliteration) {
    switch (transliteration) {
      case Transliteration.Hindi:
        return songModel.bollyName + ' Hindi Lyrics in Devanagari Script | ' + songModel.hindiTitle + ' lyrics';
      case Transliteration.Urdu:
        return songModel.bollyName + ' Urdu Lyrics in Nastaliq Script | lyrics ' + songModel.urduTitle;
      default:
        return songModel.bollyName + ' Lyrics in ISO-15919 Latinized Script';
    }
  }

  buildDescription(songModel: SongModel, transliteration: Transliteration): string {
    switch (transliteration) {
      case Transliteration.Hindi:
        return 'Lyrics of the song ' + songModel.bollyName + ' in Hindi, written in Devanagari Script, with line-by-line English translation';
      case Transliteration.Urdu:
        return 'Lyrics of the song ' + songModel.bollyName + ' in Urdu, written in Nastaliq Script, with line-by-line English translation';
      default:
        return 'Lyrics of the song ' + songModel.bollyName + ' written in Latin letters, transliterated using the ISO-15919 latinization system, with line-by-line English translation';
    }
  }

  async onResize() {
    this.updateContainerContent();
  }

  async updateContainerContent() {

    if (this.urlKey != null) {
      this.songModel = this.route.snapshot.data.songModel;
      // this.songModel = await this.songsService.retrieveSong(this.urlKey);
      if (this.songModel == null) {
        await this.router.navigateByUrl('/');
        return;
      }

      this.songsService.transliteration = this.script;
      this.songsService.populateInflectedGeo(this.songModel);
      this.songsService.populateNotInflectedGeo(this.songModel);

      // const paragraphBlocks: Node[] = this.elementRef.nativeElement.querySelectorAll('.paragraph-block');

      this.plainHtml = this.songModel.plainHtml;
      switch (this.script) {
        case Transliteration.Hindi:
          this.languageParagraphDir = 'lrt';
          this.languageParagraphClass = 'language-ltr-paragraph';
          this.languagePunctuationClass = 'ltrPunctuationMark';
          break;
        case Transliteration.Urdu:
          this.languageParagraphDir = 'rtl';
          this.languageParagraphClass = 'urdu-paragraph';
          this.languagePunctuationClass = 'rtlPunctuationMark';
          break;
        case Transliteration.Latin:
          this.languageParagraphDir = 'lrt';
          this.languageParagraphClass = 'language-ltr-paragraph';
          this.languagePunctuationClass = 'ltrPunctuationMark';
          break;
      }

      this.changeDetector.detectChanges();


    }
  }

  navigateToClickableDictionary() {
    this.router.navigate([this.clickableDictionaryLink], {});
  }

  toggleNastaliq() {
    const songContainerText = this.elementRef.nativeElement.querySelector('#song-container-text');
    const allRelevant = songContainerText.querySelectorAll('.relevant');

    if (allRelevant.forEach) {
      if (this.nastaliqCalligraphy) {
        allRelevant.forEach(span => this.renderer.addClass(span, 'nastaliq'));
      } else {
        allRelevant.forEach(span => this.renderer.removeClass(span, 'nastaliq'));
      }

      this.songsService.useNastaliq = this.nastaliqCalligraphy;

    }

  }

}
