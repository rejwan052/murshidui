import {Transliteration} from './Transliteration';
import {OrderSongsBy} from './OrderSongsBy';


export class EnumUtils {
    static transliterationFromString(enumName: string): Transliteration {
        switch (enumName) {
            case 'Hindi':
                return Transliteration.Hindi;
            case 'Urdu':
                return Transliteration.Urdu;
            case 'Latin':
                return Transliteration.Latin;
            default:
                throw new Error('string ' + enumName + ' is not a known transliteration');
        }
    }

    static sortFromString(enumName: string): OrderSongsBy {
        switch (enumName) {
            case 'alpha':
                return OrderSongsBy.alpha;
            case 'post':
                return OrderSongsBy.post;
            case 'release':
              return OrderSongsBy.release;
            default:
                  throw new Error('string ' + enumName + ' is not a known orderSongsBy');
        }
    }



}
