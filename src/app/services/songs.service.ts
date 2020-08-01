import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SongModel} from '../models/SongModel';
import {InflectedKey} from '../models/InflectedKey';
import {MasterDictionaryKey} from '../models/MasterDictionaryKey';
import {Transliteration} from '../models/Transliteration';
import {InflectedLine} from '../models/InflectedLine';
import {MasterLine} from '../models/MasterLine';
import {SongSelector} from '../models/SongSelector';
import {MeaningRequestView} from '../models/MeaningRequestView';
import {MeaningResponseView} from '../models/MeaningResponseView';
import {environment} from '../../environments/environment';
import {OrderSongsBy} from '../models/OrderSongsBy';
import {Globals} from './globals.service';
import {MeaningScreen} from '../models/MeaningScreen';
import {CountWithVersion} from '../models/CountWithVersion';
import {catchError} from 'rxjs/operators';


@Injectable()
export class SongsService {

  // item-related
  public itemHoverChange = new BehaviorSubject<string>(null);
  public itemHoverChangeObservable = this.itemHoverChange.asObservable();

  constructor(private http: HttpClient, private globals: Globals) {
    this.itemHoverChangeObservable.subscribe(message => {

      if (message == null) {
        return;
      }

      if (this.inflectedGeo == null) {
        return;
      }

      this.meaningScreen = new MeaningScreen();

      const meaningRequestView = new MeaningRequestView();
      meaningRequestView.inflected_key = this.inflectedGeo.get(Number(message));
      meaningRequestView.direct_master_references = this.notInflectedGeo.get(Number(message));
      meaningRequestView.transliteration = this.transliteration;

      this.retrieveMeanings(meaningRequestView).then(meaningResponse => {
        if (meaningResponse != null) {
          this.meaningScreen.inflected_word = meaningResponse.inflected_word;
          this.meaningScreen.canonical_word = meaningResponse.canonical_word;
          this.meaningScreen.accidence = meaningResponse.accidence;
          this.meaningScreen.part_of_speech = meaningResponse.part_of_speech;
          this.meaningScreen.show_canonical = !meaningResponse.hide_canonical;
          this.meaningScreen.meaning = meaningResponse.meaning;
          this.meaningScreen.phrases = new Map<string, string>();
          this.meaningScreen.useNastaliq = this.useNastaliq;

          Object.keys(meaningResponse.phrases).forEach(key => {
            this.meaningScreen.phrases.set(key, meaningResponse.phrases[key]);
          });
        }
      });
    });

  }


  public inflectedGeo: Map<Number, InflectedKey>;
  public notInflectedGeo: Map<Number, MasterDictionaryKey[]>;
  public useNastaliq: boolean;
  public meaningScreen: MeaningScreen;


  public transliteration: Transliteration;

  private countWithVersion: CountWithVersion;


  async retrieveSong(urlKey: string, transliteration: string): Promise<SongModel> {
    return this.http.get<SongModel>(environment.javaHost + '/murshid-api/songs/findByUrlKey',
      {
        params: {
          url_key: urlKey,
          transliteration
        }
      })
      .toPromise();
  }

  async retrieveSelectorsCount(): Promise<CountWithVersion> {
    if (this.countWithVersion === undefined) {
      await this.http.get<CountWithVersion>(environment.javaHost + '/murshid-api/songs/allSelectorsCount')
        .pipe(
          catchError((err) => {
            console.error('error when calling /murshid-api/songs/allSelectorsCount ' + err);
            alert('error when calling /murshid-api/songs/allSelectorsCount ' + err);
            return  of(new CountWithVersion(0, '0'));
          })
        )
        .toPromise()
        .then(n => this.countWithVersion = n);
      return this.countWithVersion;
    } else {
      return this.countWithVersion;
    }
  }


  async retrieveAllSelectorsInitial(orderBy: OrderSongsBy, pageNumber: number): Promise<SongSelector[]> {
    return this.http.get<SongSelector[]>(environment.javaHost + '/murshid-api/songs/allSelectors',
      {
        params: {
          order_by: orderBy.toString(),
          page_number: pageNumber.toString(),
          page_size: this.globals.pageSize.toString()
        }
      })
      .pipe(
        catchError((err) => {
          console.error('error when calling /murshid-api/selector/all in retrieveAllSelectorsInitial ' + err);
          alert('error when calling /murshid-api/selector/all in retrieveAllSelectorsInitial ' + err);
          return of([]);
        })
      )
      .toPromise();
  }

  async retrieveSelectorsWithTagCount(tagKey: string): Promise<CountWithVersion> {
    let count: CountWithVersion;
    await this.http.get<CountWithVersion>(environment.javaHost + '/murshid-api/songs/allSelectorsWithTagCount', {
      params: {tag_key: tagKey}
    }).toPromise().then(n => count = n);
    return count;
  }

  async retrieveSelectorsWithTag(tagKey: string, orderBy: OrderSongsBy, pageNumber: number): Promise<SongSelector[]> {
    return this.http.get<SongSelector[]>(environment.javaHost + '/murshid-api/songs/allSelectorsWithTag',
      {
        params: {
          order_by: orderBy.toString(),
          tag_key:  tagKey,
          page_number: pageNumber.toString(),
          page_size: this.globals.pageSize.toString()
        }
      })
      .toPromise();
  }

  async retrieveMeanings(meaningRequest: MeaningRequestView): Promise<MeaningResponseView> {
    return this.http.post<MeaningResponseView>(environment.javaHost + '/murshid-api/dictionaries/obtainmeaning', meaningRequest)
      .toPromise();
  }

  public populateInflectedGeo(song: SongModel) {
    this.inflectedGeo = new Map<Number, InflectedKey>();

    if (song.inflectedLines != null) {

      song.inflectedLines.forEach(entry => {
        const wlm = entry as InflectedLine;
        if (wlm.position == null) {
          alert(wlm + ' has no position');
        }
        const inflectedKey = new InflectedKey();
        inflectedKey.inflected_hindi_index = wlm.hindi_index;
        inflectedKey.inflected_hindi = wlm.hindi;
        this.inflectedGeo.set(wlm.position, inflectedKey);
      });

    } else {
      alert('No inflectedReferences found for song: ' + song.bollyName);
    }
  }

  populateNotInflectedGeo(song: SongModel) {
    this.notInflectedGeo = new Map<Number, MasterDictionaryKey[]>();

    if (song.masterLineItems != null) {
      song.masterLineItems.forEach(entry => {
        const mal: MasterLine = entry as MasterLine;
        if (!this.notInflectedGeo.has(mal.position)) {
          this.notInflectedGeo.set(mal.position, []);
        }
        const masterDictionaryKey = new MasterDictionaryKey();
        masterDictionaryKey.hindi = mal.hindi;
        masterDictionaryKey.hindi_index = mal.hindi_index;
        this.notInflectedGeo.get(mal.position).push(masterDictionaryKey);
      });
    } else {
      alert('No direct masterLineItems references  found for song: ' + song.bollyName);
    }
  }


}
