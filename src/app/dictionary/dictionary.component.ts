import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {WordUtils} from '../utils/WordUtils';
import {Scripts} from '../models/Scripts';
import {DictionariesAndSongs} from '../models/DictionariesAndSongs';
import {Transliteration} from '../models/Transliteration';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit, OnDestroy {

  private sub: any;
  dictionariesAndSongs: DictionariesAndSongs;
  searchWord: string;
  isNastaliq: boolean;

  constructor(private route: ActivatedRoute, private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params.word !== undefined) {
        this.searchWord = params.word;
        this.dictionariesAndSongs = this.route.snapshot.data.dictionariesAndSongs;


        let attributeSelector = 'name="description"';
        this.meta.removeTag(attributeSelector);
        this.buildTitleAndDescription();

        attributeSelector = 'name="og:image"';
        this.meta.removeTag(attributeSelector);
      }
    });

    if (this.searchWord !== undefined) {
      this.translateTitles();
    }
  }

  thereAreDictionaryviews(): boolean {
    return this.dictionariesAndSongs !== undefined && this.dictionariesAndSongs.dictionary_views !== undefined && this.dictionariesAndSongs.dictionary_views.length > 0;
  }

  thereAreSongSelectors(): boolean {
    return this.dictionariesAndSongs !== undefined && this.dictionariesAndSongs.song_selectors !== undefined && this.dictionariesAndSongs.song_selectors.length > 0;
  }

  translateTitles(): void {
    const script = WordUtils.scriptType(this.searchWord);
    this.dictionariesAndSongs.song_selectors.forEach( selector => {
      if (script === Scripts.DEVANAGARI) {
        selector.bollyName = selector.hindiName;
        selector.transliteration = Transliteration.Hindi;
      } else if (script === Scripts.NASTALIQ) {
        selector.bollyName = selector.urduName;
        selector.transliteration = Transliteration.Urdu;
      }
    });

  }

  buildTitleAndDescription(): void {
    const script = WordUtils.scriptType(this.searchWord);

    let description = this.dictionariesAndSongs.dictionary_views.length + ' English meaning(s) were found ';

    if (script === Scripts.NASTALIQ) {
      this.isNastaliq = true;
      this.title.setTitle('English meaning of the Urdu word ' + this.searchWord );
      description += ' for the Urdu word ' + this.searchWord + ' :\n';
    } else if (script === Scripts.DEVANAGARI) {
      this.isNastaliq = false;
      this.title.setTitle('English meaning of the Hindi word ' + this.searchWord );
      description += ' for the Hindi word ' + this.searchWord + ' :\n';
    }

    for (let i = 0; i < this.dictionariesAndSongs.dictionary_views.length; i++) {
      description += this.dictionariesAndSongs.dictionary_views[i].meaning;
      if (i < (this.dictionariesAndSongs.dictionary_views.length - 1)) {
        description += '\n';
      }
    }
    this.meta.updateTag({ name: 'description', content: description});
  }

  ngOnDestroy() {
    // in tests, sub might be null
    if (this.sub != null) {
      this.sub.unsubscribe();
    }
  }

}
