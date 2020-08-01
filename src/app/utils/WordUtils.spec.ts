import {WordUtils} from './WordUtils';
import {Scripts} from '../models/Scripts';


describe('WordUtil', () => {


  it('should recognize Devanagari words', () => {
    const hindi = 'हिंदी';
    expect(WordUtils.scriptType(hindi)).toEqual(Scripts.DEVANAGARI);
  });

  it('should recognize nastaliq words ', () => {
    const urdu = 'اردو ';
    expect(WordUtils.scriptType(urdu)).toEqual(Scripts.NASTALIQ);
  });

  it('should recognize Latin words ', () => {
    const latin = 'Latin';
    expect(WordUtils.scriptType(latin)).toEqual(Scripts.LATIN);
  });

});
