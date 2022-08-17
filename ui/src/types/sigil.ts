export const CLANS = ['galaxy', 'star', 'planet'] as const;
export type Clan = typeof CLANS[number];

export const PART_TYPES = ['geon', 'line', 'arc', 'bezier', 'circle', 'donut'] as const;
export type PartType = typeof PART_TYPES[number];

export const GEONS = ['gci', 'gsq', 'ghl', 'ghr', 'ght', 'ghb', 'gq1', 'gq2', 'gq3', 'gq4', 'gfs', 'gbs'];
export type Geon = typeof GEONS[number];

export type SymbolType = ('prefix' | 'suffix');

export interface ModeDef {
  modes?: ModeDefs;
  displayParts?: string[];
  parts?: string[];
}

export interface ModeDefs {
  [mode: string]: ModeDef
}


export const MODE_DEFS: ModeDefs = {
  geon: {
    modes: {},
    displayParts: ['ghb'],
  },
  line: {
    modes: {
      mainFulls: {
        parts: ['lvf', 'lhf', 'lff', 'lbf'],
      },
      halvesFulls: {
        parts: ['lvfl', 'lvfr', 'lhft', 'lhfb', 'lfht', 'lfhb', 'lbht', 'lbhb'],
      },
      forwards: {
        parts: ['lff', 'lfft', 'lffb'],
      },
      backwards: {
        parts: ['lbf', 'lbft'],
      },
      weirds: {
        parts: ['lbhtf', 'lbrf', 'lfhm'],
      }
    },
    parts: ['lvf', 'lvfl', 'lvfr', 'lhf', 'lhft', 'lhfb', 'lff', 'lbf'],
  },
  arcCorner: {
    modes: {
      trFulls: {
        parts: ['atrf8', 'atrf6', 'atrf4', 'atrf2'],
      },
      trHalves: {
        parts: [/*'atra8',*/ 'atra6', 'atra4', 'atra2', 'atrb8', 'atrb6', 'atrb4', 'atrb2'],
        displayParts: ['atrb8', 'atrb6', 'atrb4', 'atrb2'],
      },
      tlFulls: {
        parts: ['atlf8', 'atlf6', 'atlf4', 'atlf2'],
      },
      tlHalves: {
        parts: ['atla8', 'atla6', 'atla4', 'atla2', 'atlb8', 'atlb6', 'atlb4', 'atlb2'],
        displayParts: ['atlb8', 'atlb6', 'atlb4', 'atlb2'],
      },
      blFulls: {
        parts: ['ablf8', 'ablf6', 'ablf4', 'ablf2'],
      },
      blHalves: {
        parts: ['ablb8', 'ablb6', 'ablb4', 'ablb2'],
        displayParts: ['ablb8', 'ablb6', 'ablb4', 'ablb2'],
      },
      brFulls: {
        parts: ['abrf8', 'abrf6', 'abrf4', 'abrf2'],
      },
      brHalves: {
        parts: ['abrb8', 'abrb6', 'abrb4', 'abrb2'],
        displayParts: ['abrb8', 'abrb6', 'abrb4', 'abrb2'],
      },
    },
    parts: ['ablf8', 'ablf6', 'ablf4', 'ablf2'],
  },
  arc: {
    modes: {
      rings: {
        parts: ['am081', 'am082', 'am083', 'am08s'],
      },
      diagonals: {
        parts: ['am741', 'am742', 'am743', 'am422', 'am423'],
      },
      topsBottoms: {
        parts: ['ab2', 'ab3', 'ab4', 'at1', 'at3', 'at4'],
      },
      leftsRights: {
        parts: ['al2', 'al3', 'al4', 'ar1', 'ar2', 'ar4'/*, 'arb2'*/],
      },
      rights: {
        parts: ['am642', 'am643'],
      },
      middles: {
        parts: ['am222', 'am223', 'am622', 'am623'],
      },
      middless: {
        parts: ['am142', 'am443'],
      },
      topRights: {
        parts: ['am021', 'am022', 'am023', 'am242', 'arb2'],
      },
    },
    parts: ['am222', 'am223', 'ar4', 'ar2', 'ar1'],
  },
  circle: {
    modes: {
      mediums: {
        parts: [
          'cmmb',
          'ctl3mb', 'cbl3mb',
          'ct2mb', 'cb2mb', 'cl2mb', 'cr2mb', 'ctl2mb', 'ctr2mb', 'cbl2mb', 'cbr2mb',
          'ctl1mb', 'ctr1mb', 'cbl1mb', 'cbr1mb',
          'cbl3mf', 'ctr3mf', 'ctl3mf',
        ],
        displayParts: [
          'cmmb',
          'ctl3mb', 'cbl3mb',
          'ct2mb', 'cb2mb', 'cl2mb', 'cr2mb', 'ctl2mb', 'ctr2mb', 'cbl2mb', 'cbr2mb',
          'ctl1mb', 'ctr1mb', 'cbl1mb', 'cbr1mb',
          'ctr3mf',
        ],
      },
      sides: {
        parts: ['cl1mb', 'cr1mb', 'cl3mb', 'cr3mb'],
      },
      smalls: {
        parts: ['cr1sb', 'cr2sb'],
      },
    },
    displayParts: [
      'cbr3mb', 'ctl3mb',
      'cmmb',
      'ct2mb', 'cl2mb', 'cb2mb', 'cr2mb',
    ],
  },
  donut: {
    parts: ['dbl', 'dl', 'dm', 'dtl', 'dtr'],
    displayParts: ['dbl', /*'dl',*/ 'dm', 'dtl', 'dtr'],
  },
  bezier: {
    parts: ['b1l1', 'b1l2', 'b1l3', 'b4t2', 'b4t3'],
  },
};
