const prefixes = ['doz', 'mar', 'bin', 'wan', 'sam', 'lit', 'sig', 'hid', 'fid', 'lis', 'sog', 'dir', 'wac', 'sab', 'wis', 'sib', 'rig', 'sol', 'dop', 'mod', 'fog', 'lid', 'hop', 'dar', 'dor', 'lor', 'hod', 'fol', 'rin', 'tog', 'sil', 'mir', 'hol', 'pas', 'lac', 'rov', 'liv', 'dal', 'sat', 'lib', 'tab', 'han', 'tic', 'pid', 'tor', 'bol', 'fos', 'dot', 'los', 'dil', 'for', 'pil', 'ram', 'tir', 'win', 'tad', 'bic', 'dif', 'roc', 'wid', 'bis', 'das', 'mid', 'lop', 'ril', 'nar', 'dap', 'mol', 'san', 'loc', 'nov', 'sit', 'nid', 'tip', 'sic', 'rop', 'wit', 'nat', 'pan', 'min', 'rit', 'pod', 'mot', 'tam', 'tol', 'sav', 'pos', 'nap', 'nop', 'som', 'fin', 'fon', 'ban', 'mor', 'wor', 'sip', 'ron', 'nor', 'bot', 'wic', 'soc', 'wat', 'dol', 'mag', 'pic', 'dav', 'bid', 'bal', 'tim', 'tas', 'mal', 'lig', 'siv', 'tag', 'pad', 'sal', 'div', 'dac', 'tan', 'sid', 'fab', 'tar', 'mon', 'ran', 'nis', 'wol', 'mis', 'pal', 'las', 'dis', 'map', 'rab', 'tob', 'rol', 'lat', 'lon', 'nod', 'nav', 'fig', 'nom', 'nib', 'pag', 'sop', 'ral', 'bil', 'had', 'doc', 'rid', 'moc', 'pac', 'rav', 'rip', 'fal', 'tod', 'til', 'tin', 'hap', 'mic', 'fan', 'pat', 'tac', 'lab', 'mog', 'sim', 'son', 'pin', 'lom', 'ric', 'tap', 'fir', 'has', 'bos', 'bat', 'poc', 'hac', 'tid', 'hav', 'sap', 'lin', 'dib', 'hos', 'dab', 'bit', 'bar', 'rac', 'par', 'lod', 'dos', 'bor', 'toc', 'hil', 'mac', 'tom', 'dig', 'fil', 'fas', 'mit', 'hob', 'har', 'mig', 'hin', 'rad', 'mas', 'hal', 'rag', 'lag', 'fad', 'top', 'mop', 'hab', 'nil', 'nos', 'mil', 'fop', 'fam', 'dat', 'nol', 'din', 'hat', 'nac', 'ris', 'fot', 'rib', 'hoc', 'nim', 'lar', 'fit', 'wal', 'rap', 'sar', 'nal', 'mos', 'lan', 'don', 'dan', 'lad', 'dov', 'riv', 'bac', 'pol', 'lap', 'tal', 'pit', 'nam', 'bon', 'ros', 'ton', 'fod', 'pon', 'sov', 'noc', 'sor', 'lav', 'mat', 'mip', 'fip'];
const suffixes = ['zod', 'nec', 'bud', 'wes', 'sev', 'per', 'sut', 'let', 'ful', 'pen', 'syt', 'dur', 'wep', 'ser', 'wyl', 'sun', 'ryp', 'syx', 'dyr', 'nup', 'heb', 'peg', 'lup', 'dep', 'dys', 'put', 'lug', 'hec', 'ryt', 'tyv', 'syd', 'nex', 'lun', 'mep', 'lut', 'sep', 'pes', 'del', 'sul', 'ped', 'tem', 'led', 'tul', 'met', 'wen', 'byn', 'hex', 'feb', 'pyl', 'dul', 'het', 'mev', 'rut', 'tyl', 'wyd', 'tep', 'bes', 'dex', 'sef', 'wyc', 'bur', 'der', 'nep', 'pur', 'rys', 'reb', 'den', 'nut', 'sub', 'pet', 'rul', 'syn', 'reg', 'tyd', 'sup', 'sem', 'wyn', 'rec', 'meg', 'net', 'sec', 'mul', 'nym', 'tev', 'web', 'sum', 'mut', 'nyx', 'rex', 'teb', 'fus', 'hep', 'ben', 'mus', 'wyx', 'sym', 'sel', 'ruc', 'dec', 'wex', 'syr', 'wet', 'dyl', 'myn', 'mes', 'det', 'bet', 'bel', 'tux', 'tug', 'myr', 'pel', 'syp', 'ter', 'meb', 'set', 'dut', 'deg', 'tex', 'sur', 'fel', 'tud', 'nux', 'rux', 'ren', 'wyt', 'nub', 'med', 'lyt', 'dus', 'neb', 'rum', 'tyn', 'seg', 'lyx', 'pun', 'res', 'red', 'fun', 'rev', 'ref', 'mec', 'ted', 'rus', 'bex', 'leb', 'dux', 'ryn', 'num', 'pyx', 'ryg', 'ryx', 'fep', 'tyr', 'tus', 'tyc', 'leg', 'nem', 'fer', 'mer', 'ten', 'lus', 'nus', 'syl', 'tec', 'mex', 'pub', 'rym', 'tuc', 'fyl', 'lep', 'deb', 'ber', 'mug', 'hut', 'tun', 'byl', 'sud', 'pem', 'dev', 'lur', 'def', 'bus', 'bep', 'run', 'mel', 'pex', 'dyt', 'byt', 'typ', 'lev', 'myl', 'wed', 'duc', 'fur', 'fex', 'nul', 'luc', 'len', 'ner', 'lex', 'rup', 'ned', 'lec', 'ryd', 'lyd', 'fen', 'wel', 'nyd', 'hus', 'rel', 'rud', 'nes', 'hes', 'fet', 'des', 'ret', 'dun', 'ler', 'nyr', 'seb', 'hul', 'ryl', 'lud', 'rem', 'lys', 'fyn', 'wer', 'ryc', 'sug', 'nys', 'nyl', 'lyn', 'dyn', 'dem', 'lux', 'fed', 'sed', 'bec', 'mun', 'lyr', 'tes', 'mud', 'nyt', 'byr', 'sen', 'weg', 'fyr', 'mur', 'tel', 'rep', 'teg', 'pec', 'nel', 'nev', 'fes'];
const illegalCharsRegex = /[^-_*^abcdefghilmnoprstuvwxyz]/g;

// Error Messages
const emptyPatpMessage = "ID cannot be empty."
const emptyWordsMessage = "Separators (- ^ _) cannot appear next to each other, or at the beginning or end of an ID."
const invalidAbbreviations = "Moon and Comet abbreviations (using ^ or _) can only have two parts."

function illegalCharsMessage(illegalChars: string[]) {
  return 'It contains illegal characters: ' + listStrings(illegalChars);
}

function multipleWordsLengthMessage(wrongLengthWords: string[]) {
  let wordListString = listStrings(wrongLengthWords, true);
  let firstHalf = '';
  if (wrongLengthWords.length > 1) {
    firstHalf = `${wordListString} are not valid parts of a multi-part ID.`;
  } else {
    firstHalf = `${wordListString} is not a valid part of a multi-part ID.`;
  }
  return `${firstHalf} Each part must be 6 letters long.`;
}

function singleWordLengthMessage(word: string) {
  return `'${word}' must be either 3 or 6 letters long (either a galaxy or a star).`;
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

function stripTilde(str: string): string {
  if (str[0] === '~') {
    return str.substring(1);
  }
  return str;
}

function listStrings(list: string[], includeAnd: boolean = false): string {
  if (includeAnd && list.length > 1) {
    return listStrings(list.slice(0, -1)) + ' and ' + listStrings(list.slice(-1));
  }
  return "'" + list.join("', '") + "'";
}

function splitIdIntoWords(str: string): string[] {
  return str.split(/[-_^]/);
}

function convertSyllableToRegex(str: string): RegExp {
  str = str.replace(/\*/g, '.');
  return new RegExp(str);
}

function syllableSearchValid(search: string, syllables: string[]) {
  for (let syllable of syllables) {
    let regex = convertSyllableToRegex(search);
    if (regex.test(syllable)) {
      return true;
    }
  };
  return false;
}

function prefixSearchValid(prefixSearch: string) {
  return syllableSearchValid(prefixSearch, prefixes);
}

function suffixSearchValid(search: string) {
  return syllableSearchValid(search, suffixes);
}

export function validateId(patp: string): string[] {
  let problems = [];
  patp = patp.toLowerCase();
  patp = stripTilde(patp);

  // Validate patp is not empty
  if (patp.length === 0) {
    problems.push(emptyPatpMessage);
    return problems;
  }

  // Validate all characters are legal
  let illegalChars = patp.match(illegalCharsRegex);
  if (illegalChars) {
    problems.push(illegalCharsMessage(illegalChars));
  }

  // Validate word lengths
  let words = splitIdIntoWords(patp);
  if (words.length > 1) {
    let wrongLengthWords = [];
    let emptyWords = false;
    for (let word of words) {
      if (word.length !== 6) {
        if (word.length > 0) {
          wrongLengthWords.push(word);
        } else {
          emptyWords = true;
        }
      }
    }
    if (wrongLengthWords.length > 0) {
      problems.push(multipleWordsLengthMessage(wrongLengthWords));
    }
    if (emptyWords) {
      problems.push(emptyWordsMessage);
    }
  } else {
    let word = words[0];
    if (word.length !== 3 && word.length !== 6) {
      problems.push(singleWordLengthMessage(word));
    }
  }

  // Validate proper use of separators
  if (words.length > 2) {
    let manyPartIdRegex = /^(\w+-)+\w+$/;
    if (!manyPartIdRegex.test(patp)) {
      problems.push(invalidAbbreviations);
    }
  }

  // Don't bother checking syllables if there are already problems
  if (problems.length > 0) {
    return problems;
  }

  // Validate valid prefixes and suffixes
  let wrongPrefixes = [];
  let wrongSuffixes = [];
  for (let word of words) {
    let prefix = word.substring(0, 3);
    let suffix = word.substring(3, 6);
    // if galaxy
    if (!suffix) {
      suffix = prefix;
      prefix = null;
    }
    if (prefix && !prefixSearchValid(prefix)) {
      wrongPrefixes.push(prefix);
    }
    if (suffix && !suffixSearchValid(suffix)) {
      wrongSuffixes.push(suffix);
    }
  }
  if (wrongPrefixes.length > 0) {
    problems.push(invalidPrefixesMessage(wrongPrefixes));
  }
  if (wrongSuffixes.length > 0) {
    problems.push(invalidSuffixesMessage(wrongSuffixes));
  }

  return problems;
}