import type { Patp } from '@urbit/api';
import { listStrings } from './utils';

type Problem = string;

class SearchAnalysis {
  queryProblems: Problem[] = [];
  private _search: string = '';
  patpProblems: Problem[] = [];

  constructor(search: string) {
    this.search = search;
  }

  get searchIsSigged() {
    return sanitizeSearch(this._search)[0] === '~';
  }

  get query(): RegExp {
    let search = this._search;
    search = expandAbbreviatedId(search);
    if (this.searchIsSigged) search = sig(search);
    return convertSearchTextToRegex(search);
  }

  get patp(): Patp {
    return normalizeId(this._search);
  }

  get queryIsValid(): boolean {
    return this.queryProblems.length === 0;
  }

  get patpIsValid() {
    return this.patpProblems.length === 0;
  }

  get queryAndPatpAreInvalid() {
    return !this.queryIsValid && !this.patpIsValid;
  }

  get search() {
    return this._search;
  }

  set search(search: string) {
    this._search = search;
    this.analyze();
  }

  pushQueryProblem(...problems: Problem[]): void {
    if (!Object.isFrozen(this.queryProblems)) {
      this.queryProblems.push(...problems);
    }
  }

  pushPatpProblem(...problems: Problem[]): void {
    if (!Object.isFrozen(this.patpProblems)) {
      this.patpProblems.push(...problems);
    }
  }

  pushProblem(...problems: Problem[]): void {
    this.pushQueryProblem(...problems);
    this.pushPatpProblem(...problems);
  }

  checkpointQueryValidation(): void {
    if (!this.queryIsValid) {
      Object.freeze(this.queryProblems);
    }
  }

  checkpointPatpValidation(): void {
    if (!this.patpIsValid) {
      Object.freeze(this.patpProblems);
    }
  }

  checkpointValidation(): void {
    this.checkpointQueryValidation();
    this.checkpointPatpValidation();
  }

  resetAnalysis() {
    this.queryProblems = [];
    this.patpProblems = [];
  }

  // mergeAnalysis(analysis: SearchAnalysis): void {
  //   this.pushQueryProblem(...analysis.queryProblems);
  //   this.pushPatpProblem(...analysis.patpProblems);
  //   if (analysis.search) this._search = analysis.search;
  //   if (analysis.patp) this.patp = analysis.patp;
  // }

  analyze(): void {
    this.resetAnalysis();
    let search = normalizeIdAndDesig(this._search);
    
    // Validate patp is not empty
    if (search.length === 0) {
      this.pushProblem(emptyPatpMessage);
      return;
    }
  
    // Validate proper use of sig
    if (/~/.test(search)) {
      this.pushProblem(improperSigMessage);
    }
  
    // Validate all characters are legal
    let illegalQueryChars = search.match(illegalQueryCharsRegex);
    if (illegalQueryChars) {
      this.pushQueryProblem(illegalCharsMessage(illegalQueryChars));
    }
    let illegalPatpChars = search.match(illegalPatpCharsRegex);
    if (illegalPatpChars) {
      this.pushPatpProblem(illegalCharsMessage(illegalPatpChars));
    }
    if (/\^/.test(search)) {
      this.pushPatpProblem(cannotInferMoonPatpMessage);
    }
    if (/_/.test(search)) {
      this.pushPatpProblem(cannotInferCometPatpMessage);
    }
  
    // Validate separators don't appear on boundaries
    // This is fine in an unsigged query, but not a patp
    // TODO: check for if a query ends in something dumb like ^-
    let patp = search;
    if (/^[-^_]/.test(patp)) {
      this.pushPatpProblem(outsideSeparatorsMessage);
      patp = patp.replace(/^[-^_]*/, '');
      if (this.searchIsSigged) {
        this.pushQueryProblem(outsideSeparatorsMessage);
        search = patp;
      }
    }
    if (/[-^_]$/.test(patp)) {
      this.pushPatpProblem(outsideSeparatorsMessage);
      patp = patp.replace(/[-^_]*$/, '');
    }

    // Validate word lengths
    // TODO: check words for query and patp separately 😥
    // because ~min- is min- for query but min for patp
    // (b/c already stripped of extra chars)
    let words = splitIdIntoWords(patp);
    let queryWords = splitIdIntoWords(search);
    if (words.length > 1) {
      let wrongLengthPatpWords = [];
      let wrongLengthQueryWords = [];
      let emptyWords = false;
      words.forEach((word, i) => {
        if (word.length !== 6) {
          if (word.length > 0) {
            wrongLengthPatpWords.push(word);
            if ((i > 0 || this.searchIsSigged) && i < words.length - 1) {
              wrongLengthQueryWords.push(word);
            }
          } else {
            emptyWords = true;
          }
        }
      });
      if (wrongLengthPatpWords.length > 0) {
        this.pushPatpProblem(multipleWordsLengthMessage(wrongLengthPatpWords));
      }
      if (wrongLengthQueryWords.length > 0) {
        this.pushQueryProblem(multipleWordsLengthMessage(wrongLengthQueryWords));
      }
      if (emptyWords) {
        this.pushProblem(emptyWordsMessage);
      }
    } else {
      let word = words[0];
      if (word.length !== 3 && word.length !== 6) {
        this.pushPatpProblem(singleWordLengthMessage(word));
        if (word.length > 6) {
          this.pushQueryProblem(singleWordTooLongMessage(word));
        }
      }
    }

    this.checkpointValidation();

    // Validate remaining structural edge cases
    if (words.length >= 5) {
      let cometIdRegex = /^([\w*]+-)+-([\w*]+-){3}[\w*]+$/;
      if (!cometIdRegex.test(patp)) {
        this.pushPatpProblem(invalidCometIdMessage);
      }
    } else if (words.length > 2) {
      let manyPartIdRegex = /^([\w*]+-)+[\w*]+$/;
      if (!manyPartIdRegex.test(patp)) {
        this.pushPatpProblem(tooLongAbbreviationMessage);
      }
    } else if (words.length == 2) {
      let twoPartIdRegex = /^[\w*]+[-^_][\w*]+$/;
      if (!twoPartIdRegex.test(patp)) {
        this.pushPatpProblem(tooLongAbbreviationMessage);
      }
    }

    this.checkpointValidation();

    // Validate valid prefixes and suffixes
    let wrongPatpPrefixes = [];
    let wrongPatpSuffixes = [];
    let wrongQueryPrefixes = [];
    let wrongQuerySuffixes = [];
    let wrongQueryFragments = [];
    queryWords.forEach((word, i) => {
      if (!word) return;
      let patpPrefix = word.substring(0, 3);
      let patpSuffix = word.substring(3, 6);

      // if galaxy
      if (!patpSuffix) {
        patpSuffix = patpPrefix;
        patpPrefix = null;
      }
      const patpPrefixInvalid = patpPrefix && !prefixSearchValid(patpPrefix);
      if (patpPrefixInvalid) {
        wrongPatpPrefixes.push(patpPrefix);
      }
      const patpSuffixInvalid = patpSuffix && !suffixSearchValid(patpSuffix);
      if (patpSuffixInvalid) {
        wrongPatpSuffixes.push(patpSuffix);
      }
      const hasLeftNeighboringWord = i > 0 || this.searchIsSigged;
      const hasRightNeighboringWord = i < queryWords.length -1;
      let minLeftSplit = hasLeftNeighboringWord ? Math.min(3, word.length) : 0;
      // if maybe galaxy
      if (queryWords.length === 1 && word.length <= 3) minLeftSplit = 0;
      const maxRightSplit = hasRightNeighboringWord ? Math.max(word.length - 3, 0) : word.length;
      
      // Please forgive this black magic
      const diff = 7 - word.length;
      const splitIndexes = [];
      for (let j = 0; j < diff; j++) {
        let splitIndex = 3 - j;
        if (splitIndex >= minLeftSplit && splitIndex <= maxRightSplit) {
          splitIndexes.push(splitIndex);
        }
      }
      let wordInvalid = true;
      let queryPrefix;
      let queryPrefixInvalid;
      let querySuffix;
      let querySuffixInvalid;
      for (let splitIndex of splitIndexes) {
        queryPrefix = word.substring(0, splitIndex);
        querySuffix = word.substring(splitIndex, word.length);

        queryPrefixInvalid = queryPrefix && !prefixSearchValid(queryPrefix, { checkEnd: word.length >= 3 });
        querySuffixInvalid = querySuffix && !suffixSearchValid(querySuffix, { checkStart: word.length >= 3 });
        let wordValid = (!queryPrefixInvalid && !querySuffixInvalid);
        if (wordValid) {
          wordInvalid = false;
        }
      }
      if(wordInvalid && !wrongQueryFragments.includes(word)) {
        if (splitIndexes.length == 1) {
          if (queryPrefixInvalid) wrongQueryPrefixes.push(queryPrefix);
          if (querySuffixInvalid) wrongQuerySuffixes.push(querySuffix);
        } else {
          wrongQueryFragments.push(word);
        }
      }
    });
    if (wrongPatpPrefixes.length > 0) {
      this.pushPatpProblem(invalidPrefixesMessage(wrongPatpPrefixes));
    }
    if (wrongPatpSuffixes.length > 0) {
      this.pushPatpProblem(invalidSuffixesMessage(wrongPatpSuffixes));
    }
    if (wrongQueryPrefixes.length > 0) {
      this.pushQueryProblem(invalidPrefixesMessage(wrongQueryPrefixes));
    }
    if (wrongQuerySuffixes.length > 0) {
      this.pushQueryProblem(invalidSuffixesMessage(wrongQuerySuffixes));
    }
    if (wrongQueryFragments.length > 0) {
      this.pushQueryProblem(invalidFragmentsMessage(wrongQueryFragments));
    }
  }
}


const prefixes = ['doz', 'mar', 'bin', 'wan', 'sam', 'lit', 'sig', 'hid', 'fid', 'lis', 'sog', 'dir', 'wac', 'sab', 'wis', 'sib', 'rig', 'sol', 'dop', 'mod', 'fog', 'lid', 'hop', 'dar', 'dor', 'lor', 'hod', 'fol', 'rin', 'tog', 'sil', 'mir', 'hol', 'pas', 'lac', 'rov', 'liv', 'dal', 'sat', 'lib', 'tab', 'han', 'tic', 'pid', 'tor', 'bol', 'fos', 'dot', 'los', 'dil', 'for', 'pil', 'ram', 'tir', 'win', 'tad', 'bic', 'dif', 'roc', 'wid', 'bis', 'das', 'mid', 'lop', 'ril', 'nar', 'dap', 'mol', 'san', 'loc', 'nov', 'sit', 'nid', 'tip', 'sic', 'rop', 'wit', 'nat', 'pan', 'min', 'rit', 'pod', 'mot', 'tam', 'tol', 'sav', 'pos', 'nap', 'nop', 'som', 'fin', 'fon', 'ban', 'mor', 'wor', 'sip', 'ron', 'nor', 'bot', 'wic', 'soc', 'wat', 'dol', 'mag', 'pic', 'dav', 'bid', 'bal', 'tim', 'tas', 'mal', 'lig', 'siv', 'tag', 'pad', 'sal', 'div', 'dac', 'tan', 'sid', 'fab', 'tar', 'mon', 'ran', 'nis', 'wol', 'mis', 'pal', 'las', 'dis', 'map', 'rab', 'tob', 'rol', 'lat', 'lon', 'nod', 'nav', 'fig', 'nom', 'nib', 'pag', 'sop', 'ral', 'bil', 'had', 'doc', 'rid', 'moc', 'pac', 'rav', 'rip', 'fal', 'tod', 'til', 'tin', 'hap', 'mic', 'fan', 'pat', 'tac', 'lab', 'mog', 'sim', 'son', 'pin', 'lom', 'ric', 'tap', 'fir', 'has', 'bos', 'bat', 'poc', 'hac', 'tid', 'hav', 'sap', 'lin', 'dib', 'hos', 'dab', 'bit', 'bar', 'rac', 'par', 'lod', 'dos', 'bor', 'toc', 'hil', 'mac', 'tom', 'dig', 'fil', 'fas', 'mit', 'hob', 'har', 'mig', 'hin', 'rad', 'mas', 'hal', 'rag', 'lag', 'fad', 'top', 'mop', 'hab', 'nil', 'nos', 'mil', 'fop', 'fam', 'dat', 'nol', 'din', 'hat', 'nac', 'ris', 'fot', 'rib', 'hoc', 'nim', 'lar', 'fit', 'wal', 'rap', 'sar', 'nal', 'mos', 'lan', 'don', 'dan', 'lad', 'dov', 'riv', 'bac', 'pol', 'lap', 'tal', 'pit', 'nam', 'bon', 'ros', 'ton', 'fod', 'pon', 'sov', 'noc', 'sor', 'lav', 'mat', 'mip', 'fip'];
const suffixes = ['zod', 'nec', 'bud', 'wes', 'sev', 'per', 'sut', 'let', 'ful', 'pen', 'syt', 'dur', 'wep', 'ser', 'wyl', 'sun', 'ryp', 'syx', 'dyr', 'nup', 'heb', 'peg', 'lup', 'dep', 'dys', 'put', 'lug', 'hec', 'ryt', 'tyv', 'syd', 'nex', 'lun', 'mep', 'lut', 'sep', 'pes', 'del', 'sul', 'ped', 'tem', 'led', 'tul', 'met', 'wen', 'byn', 'hex', 'feb', 'pyl', 'dul', 'het', 'mev', 'rut', 'tyl', 'wyd', 'tep', 'bes', 'dex', 'sef', 'wyc', 'bur', 'der', 'nep', 'pur', 'rys', 'reb', 'den', 'nut', 'sub', 'pet', 'rul', 'syn', 'reg', 'tyd', 'sup', 'sem', 'wyn', 'rec', 'meg', 'net', 'sec', 'mul', 'nym', 'tev', 'web', 'sum', 'mut', 'nyx', 'rex', 'teb', 'fus', 'hep', 'ben', 'mus', 'wyx', 'sym', 'sel', 'ruc', 'dec', 'wex', 'syr', 'wet', 'dyl', 'myn', 'mes', 'det', 'bet', 'bel', 'tux', 'tug', 'myr', 'pel', 'syp', 'ter', 'meb', 'set', 'dut', 'deg', 'tex', 'sur', 'fel', 'tud', 'nux', 'rux', 'ren', 'wyt', 'nub', 'med', 'lyt', 'dus', 'neb', 'rum', 'tyn', 'seg', 'lyx', 'pun', 'res', 'red', 'fun', 'rev', 'ref', 'mec', 'ted', 'rus', 'bex', 'leb', 'dux', 'ryn', 'num', 'pyx', 'ryg', 'ryx', 'fep', 'tyr', 'tus', 'tyc', 'leg', 'nem', 'fer', 'mer', 'ten', 'lus', 'nus', 'syl', 'tec', 'mex', 'pub', 'rym', 'tuc', 'fyl', 'lep', 'deb', 'ber', 'mug', 'hut', 'tun', 'byl', 'sud', 'pem', 'dev', 'lur', 'def', 'bus', 'bep', 'run', 'mel', 'pex', 'dyt', 'byt', 'typ', 'lev', 'myl', 'wed', 'duc', 'fur', 'fex', 'nul', 'luc', 'len', 'ner', 'lex', 'rup', 'ned', 'lec', 'ryd', 'lyd', 'fen', 'wel', 'nyd', 'hus', 'rel', 'rud', 'nes', 'hes', 'fet', 'des', 'ret', 'dun', 'ler', 'nyr', 'seb', 'hul', 'ryl', 'lud', 'rem', 'lys', 'fyn', 'wer', 'ryc', 'sug', 'nys', 'nyl', 'lyn', 'dyn', 'dem', 'lux', 'fed', 'sed', 'bec', 'mun', 'lyr', 'tes', 'mud', 'nyt', 'byr', 'sen', 'weg', 'fyr', 'mur', 'tel', 'rep', 'teg', 'pec', 'nel', 'nev', 'fes'];
const illegalPatpCharsRegex = /[^-_^~abcdefghilmnoprstuvwxyz]/g;
const illegalQueryCharsRegex = /[^-_*^~abcdefghilmnoprstuvwxyz]/g;

const wildWord = '******';
const moonFiller = `${wildWord}-${wildWord}`;
const cometFiller = `-${wildWord}-${wildWord}-${wildWord}--${wildWord}-${wildWord}-${wildWord}-`;

// Error Messages
const emptyPatpMessage = "ID cannot be empty.";
const improperSigMessage = "There should only be one ~ in an ID, at the beginning.";
const cannotInferMoonPatpMessage = "Please enter the full moon ID, rather than using the '^' abbreviation.";
const cannotInferCometPatpMessage = "Please enter the full comet ID, rather than using the '_' abbreviation.";
const emptyWordsMessage = "Separators (- ^ _) cannot appear next to each other, except for a '--' before the last four parts of a comet ID.";
const separatorsNeighboringMessage = "Separators (- ^ _) cannot appear next to each other, except for a '--' before the last four parts of a comet ID.";
const outsideSeparatorsMessage = "Separators (- ^ _) cannot appear at the beginning or end of an ID.";
const invalidCometIdMessage = "Comet IDs should be 16 syllables, in groups of two, separated by '-', and by '--' in the very middle.";;
const tooLongAbbreviationMessage = "Moon and Comet abbreviations (using ^ or _) can only have two parts.";

function illegalCharsMessage(illegalChars: string[]) {
  return 'It contains illegal characters: ' + listStrings(illegalChars);
}

function multipleWordsLengthMessage(wrongLengthWords: string[]) {
  let wordListString = listStrings(wrongLengthWords, true);
  let firstHalf = '';
  if (wrongLengthWords.length > 1) {
    firstHalf = `${wordListString} are the wrong lengths.`;
  } else {
    firstHalf = `${wordListString} is the wrong length.`;
  }
  return `${firstHalf} Each part of a planet, moon, or comet ID must be 6 letters long.`;
}

function singleWordLengthMessage(word: string) {
  return `'${word}' must be either 3 or 6 letters long (either a galaxy or a star).`;
}

function singleWordTooLongMessage(word: string) {
  return `'${word}' will not match any IDs. It should not be longer than 6 letters.`;
}

function invalidSyllablesMessage(syllables: string[], syllableSet: string) {
  let wordListString = listStrings(syllables, true);
  return `${wordListString} did not match any ${syllableSet}.`;
}

function invalidPrefixesMessage(syllables: string[]) {
  return invalidSyllablesMessage(syllables, 'prefixes');
}

function invalidSuffixesMessage(syllables: string[]) {
  return invalidSyllablesMessage(syllables, 'suffixes');
}

function invalidFragmentsMessage(fragments: string[]) {
  let wordListString = listStrings(fragments, true);
  return `${wordListString} cannot match any prefix/suffix combinations.`;
}

function sig(str: string): string {
  if (str[0] !== '~') {
    return '~' + str;
  }
  return str;
}

function desig(str: string): string {
  if (str[0] === '~') {
    return str.substring(1);
  }
  return str;
}

function sanitizeSearch(search: string): string {
  return search.toLowerCase().trim();
}

function normalizeId(patp: string): string {
  return sig(sanitizeSearch(patp));
}

function normalizeIdAndDesig(patp: string): string {
  return desig(sanitizeSearch(patp));
}

function splitIdIntoWords(str: string): string[] {
  return str.split(/(?:--|[-_^])/);
}

function padWithWild(search: string) {
  let words = search.split(/[_^]/);
  words[0] = '*'.repeat(6 - words[0].length) + words[0];
  words[1] += '*'.repeat(6 - words[1].length);
  return words.join(search.match(/([_^])/)[1]);
}

function convertSearchTextToRegex(str: string, { checkStart = false, checkEnd = false } = {}): RegExp {
  str = str.replace(/\*/g, '.');
  if (checkStart) {
    str = '^' + str;
  }
  if (checkEnd) {
    str = str + '$';
  }
  return new RegExp(str);
}

function expandAbbreviatedId(patp: string): string {
  patp = normalizeIdAndDesig(patp);
  if (/\^/.test(patp)) {
    patp = padWithWild(patp);
    patp = '~' + moonFiller + '-' + patp.replace(/\^/, '-') + '$';
  } else if (/_/.test(patp)) {
    patp = padWithWild(patp);
    patp = '~' + patp.replace('_', cometFiller);
  }
  return patp;
}


function syllableSearchValid(search: string, syllables: string[], options = {}) {
  for (let syllable of syllables) {
    let regex = convertSearchTextToRegex(search, options);
    if (regex.test(syllable)) {
      return true;
    }
  };
  return false;
}

function prefixSearchValid(prefixSearch: string, options = {}) {
  return syllableSearchValid(prefixSearch, prefixes, options);
}

function suffixSearchValid(search: string, options = {}) {
  return syllableSearchValid(search, suffixes, options);
}



function analyzeSearch(search: string): SearchAnalysis {
  return new SearchAnalysis(search);
}

export {
  SearchAnalysis,
  normalizeId,
  normalizeIdAndDesig,
  convertSearchTextToRegex,
  analyzeSearch,
};
