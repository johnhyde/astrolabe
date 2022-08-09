export const CLANS = ['galaxy', 'star', 'planet'] as const;
export type Clan = typeof CLANS[number];

export const PART_TYPES = ['geon', 'line', 'arc', 'ring', 'circle', 'donut', 'bezier'] as const;
export type PartType = typeof PART_TYPES[number];

export const GEONS = ['gci', 'gsq', 'ghl', 'ghr', 'ght', 'ghb', 'gq1', 'gq2', 'gq3', 'gq4', 'gfs', 'gbs'];
export type Geon = typeof GEONS[number];

export type SymbolType = ('prefix' | 'suffix');

export class SymbolQuery {
  symbolType: SymbolType;
  components: string[];

  constructor(symbolType: SymbolType = 'suffix', components = []) {
    this.symbolType = symbolType;
    this.components = components;
  }

  set geon(geon: Geon) {
    this.components = this.components.filter(c => c[0] !== 'g');
    if (geon)
      this.components = [geon, ...this.components];
  }

  get geon(): Geon {
    return this.components.find(c => c[0] === 'g');
  }
}
