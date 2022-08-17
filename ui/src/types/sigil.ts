import without from 'lodash/without';
import uniq from 'lodash/uniq';

export const CLANS = ['galaxy', 'star', 'planet'] as const;
export type Clan = typeof CLANS[number];

export const PART_TYPES = ['geon', 'line', 'arc', 'circle', 'donut', 'bezier'] as const;
export type PartType = typeof PART_TYPES[number];

export const GEONS = ['gci', 'gsq', 'ghl', 'ghr', 'ght', 'ghb', 'gq1', 'gq2', 'gq3', 'gq4', 'gfs', 'gbs'];
export type Geon = typeof GEONS[number];

export type SymbolType = ('prefix' | 'suffix');

function getComplementaryCircleId(circleId: string): string {
  let newId = circleId.replace(/m(?=.$)/, 'l');
  if (newId === circleId) {
    newId = circleId.replace(/l(?=.$)/, 'm');
  }
  circleId = newId;
  circleId = circleId.replace(/f$/, 'b');
  if (newId === circleId) {
    circleId = circleId.replace(/b$/, 'f');
  }
  return circleId;
}

function getPartTypeIndex(partId: string): number {
  return PART_TYPES.findIndex(p => p[0] === partId[0]);
}

export class SymbolQuery {
  symbolType: SymbolType;
  components: string[];

  constructor(symbolType: SymbolType = 'suffix', components = []) {
    this.symbolType = symbolType;
    this.components = components;
    this.cleanupParts();
  }

  set geon(geon: Geon) {
    this.components = this.components.filter(c => c[0] !== 'g');
    if (geon)
      this.components = [geon, ...this.components];
  }

  get geon(): Geon {
    return this.components.find(c => c[0] === 'g');
  }

  cleanupParts() {
    this.components = uniq(this.components);
    this.components = this.components.sort((c1, c2) => {
      let i1 = getPartTypeIndex(c1);
      let i2 = getPartTypeIndex(c2);
      let diff = i1 - i2;
      if (diff !== 0) return diff;
      if (c1[0] === 'c') {
        return c1.localeCompare(c2);
      } else {
        return c2.localeCompare(c1);
      }
    });
  }

  clearPartType(partType: PartType) {
    this.components = this.components.filter(c => c[0] !== partType[0]);
    return this;
  }

  clear() {
    this.components = [];
    return this;
  }

  addPart(partId: string) {
    this.components = [...this.components, partId];
    if (partId[0] === 'c') {
      const otherPartId = getComplementaryCircleId(partId);
      this.components = [...this.components, otherPartId];
    }
    this.cleanupParts();
    return this;
  }

  removePart(partId: string) {
    this.components = without(this.components, partId);
    if (partId[0] === 'c') {
      const otherPartId = getComplementaryCircleId(partId);
      this.components = without(this.components, otherPartId);
    }
    this.cleanupParts();
    return this;
  }
}
