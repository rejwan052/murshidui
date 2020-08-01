import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {SelectorItem} from '../models/SelectorItem';
import {SelectorItemType} from '../models/SelectorItemType';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SelectorsService} from '../services/selectors.service';
import {Router} from '@angular/router';
import {Globals} from '../services/globals.service';
import {Transliteration} from '../models/Transliteration';
import {WordUtils} from '../utils/WordUtils';
import {Scripts} from '../models/Scripts';


interface SearchType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  encapsulation: ViewEncapsulation.None  // to override mat-select-arrow
})
export class SelectorComponent implements OnInit {
  myControl = new FormControl();
  songOptions: SelectorItem[];
  tagOptions: SelectorItem[];
  filteredOptions: Observable<SelectorItem[]>;
  scriptUsed: Scripts;

  // for the magnifier button
  private selectedItem: SelectorItem;

  // key of the searchType selected
  selectedSearchTypeValue: string;

  searchTypes: SearchType[];

  constructor(selectorsService: SelectorsService, private router: Router, private globals: Globals, private elementRef: ElementRef, private changeDetector: ChangeDetectorRef) {
    this.songOptions = [];
    this.tagOptions = [];
    selectorsService.retrieveAllItems().then(result => {
      result.forEach(option => {
        if (option.type === SelectorItemType.Tag) {
          this.tagOptions.push(option);
        } else if (option.type === SelectorItemType.Song) {
          this.songOptions.push(option);
        }
      });
    });


    this.searchTypes = [
      {value: 'songs', viewValue: 'Songs'},
      {value: 'words', viewValue: 'Words'},
      {value: 'tags', viewValue: 'Tags'}
    ];
  }

  simulateSearchTypeClick() {
    const searchSelectTypeControl = this.elementRef.nativeElement.querySelector('.mat-select-trigger');
    searchSelectTypeControl.click();
  }

  obtainSelectedViewValue() {
    if (this.selectedSearchTypeValue === undefined) {
      return this.searchTypes[0].viewValue;
    } else {
      for (let i = 0; i < this.searchTypes.length; i++) {
        if (this.searchTypes[i].value === this.selectedSearchTypeValue) {
          return this.searchTypes[i].viewValue;
        }
      }
    }
  }

  eraseContent() {
    this.selectedItem = null;
    this.myControl.setValue('');
    const inputElement = this.elementRef.nativeElement.querySelector('#searchInputText');
    switch (this.selectedSearchTypeValue) {
      case 'songs':
        inputElement.setAttribute('placeholder', 'Ex: साँस, سانس or Saans');
        break;
      case 'words':
        inputElement.setAttribute('placeholder', 'Ex: दिल or دل');
        break;
      case 'tags':
        inputElement.setAttribute('placeholder', 'Ex: काजोल, کاجول or Kajol');
        break;
    }
  }

  ngOnInit() {
    this.selectedSearchTypeValue = 'songs';
    const inputElement = this.elementRef.nativeElement.querySelector('#searchInputText');
    inputElement.setAttribute('placeholder', 'Ex: साँस, سانس or Saans');
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filter(val) : [])
      );
  }

  async searchTypeSelected() {
    this.eraseContent();
  }

  async somethingSelected() {
    const selectedItemType = typeof this.myControl.value;

    switch (selectedItemType) {
      case 'object':
        const selectedOption = this.myControl.value as SelectorItem;
        if (selectedOption === null) {
          return;
        }
        if (this.selectedSearchTypeValue === 'songs') {
          switch (this.scriptUsed) {
            case Scripts.DEVANAGARI:
              this.globals.transliteration = Transliteration.Hindi;
              break;
            case Scripts.NASTALIQ:
              this.globals.transliteration = Transliteration.Urdu;
              break;
            default:
              this.globals.transliteration = Transliteration.Latin;
              break;
          }
          await this.router.navigate(['/song/' + Transliteration[this.globals.transliteration].toString() + '/' + selectedOption.key], {});
        } else if (this.selectedSearchTypeValue === 'tags') {
          await this.router.navigate(['/tag/' + selectedOption.key]);
        }
        break;
      case 'string':
        const word = this.myControl.value as string;
        if (word === null) {
          return;
        }
        await this.router.navigate(['/dictionary/' + word.trim()]);
        break;
      case 'undefined':
        break;
    }
  }

  async searchWord() {
    let word = this.myControl.value;
    if (word === undefined) {
      return;
    }
    word = word.toString().trim();
    await this.router.navigate(['/dictionary/' + word], {});
  }

  onKeydown($event) {
    this.somethingSelected();
  }

  displayFn(item?: SelectorItem): string | undefined {
    switch (this.scriptUsed) {
      case Scripts.DEVANAGARI:
        return item ? item.hindi : undefined;
      case Scripts.NASTALIQ:
        return item ? item.urdu : undefined;
      default:
        return item ? item.title : undefined;
    }
  }

  displayInProperScript(item: SelectorItem) {
    switch (this.scriptUsed) {
      case Scripts.DEVANAGARI:
        return item ? item.hindi : undefined;
      case Scripts.NASTALIQ:
        return item ? item.urdu : undefined;
      default:
        return item ? item.title : undefined;
    }
  }



  filter(val: string): SelectorItem[] {
    if (this.songOptions === undefined) {
      return;
    }

    this.scriptUsed = WordUtils.scriptType(val);

    if (this.selectedSearchTypeValue === 'songs') {
      return this.songOptions.filter(option => {
        switch (this.scriptUsed) {
          case Scripts.LATIN:
            if (option.title === undefined) {
              console.error('title of ' + option +  ' is undefined');
              return false;
            }
            return option.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
          case Scripts.DEVANAGARI:
            if (option.hindi === undefined) {
              console.error('hindi of ' + option +  ' is undefined');
              return false;
            }
            return option.hindi.indexOf(val.toLowerCase()) >= 0;
          case Scripts.NASTALIQ:
            if (option.urdu === undefined) {
              console.error('urdu of ' + option +  ' is undefined');
              return false;
            }
            return option.urdu.indexOf(val.toLowerCase()) >= 0;
        }


      });
    } else if (this.selectedSearchTypeValue === 'tags') {
      return this.tagOptions.filter(option => {
        switch (this.scriptUsed) {
          case Scripts.LATIN:
            if (option.title === undefined) {
              console.error('title of ' + option +  ' is undefined');
              return false;
            }
            return option.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
          case Scripts.DEVANAGARI:
            if (option.hindi === undefined) {
              console.error('hindi of ' + option +  ' is undefined');
              return false;
            }
            return option.hindi.indexOf(val.toLowerCase()) >= 0;
          case Scripts.NASTALIQ:
            if (option.urdu === undefined) {
              console.error('urdu of ' + option +  ' is undefined');
              return false;
            }
            return option.urdu.indexOf(val.toLowerCase()) >= 0;
        }
      });
    }
  }
}
