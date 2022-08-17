import intersection from 'lodash/intersection';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import { partParents, symbolDefs } from '@johnhyde/sigil-js';

import type { Clan, Geon, ModeDef, PartType, SymbolType } from 'types/sigil';
import { PART_TYPES } from 'types/sigil';
import { prefixes, suffixes } from 'lib/id';

export function sigilScalingFunction(size: number): number {
  return 3.5 * Math.sqrt(51 / size);
}

export class SigilQuery {
  clan: Clan;
  symbols: SymbolQuery[];
  allowFictional: boolean = false;

  constructor(clan: Clan = 'planet', symbols = []) {
    this.clan = clan;
    this.symbols = symbols;
    this.padSymbols();
  }

  padSymbols() {
    if (this.symbols.length === 1) {
      this.symbols.unshift(new SymbolQuery(this));
    }
    while (this.symbols.length < 4) {
      this.symbols.push(new SymbolQuery(this));
    }
    this.symbols = this.symbols.slice(0, 4);
    this.symbols.forEach((symbol, i) => {
      if (i % 2 === 0) {
        symbol.symbolType = 'prefix';
      } else {
        symbol.symbolType = 'suffix';
        // symbol.components = ['gsq', 'ablf2']
      }
    });
    this.symbols = this.symbols;
  }

  get activeSymbols() {
    if (this.clan === 'galaxy')
      return [this.symbols[1]];
    if (this.clan === 'star')
      return this.symbols.slice(0, 2);
    return this.symbols;
  }

  get isPlausible() {
    return this.activeSymbols.every(symbol => !symbol.isPlausible);
  }

  get string(): string {
    return this.symbols.map((symbol) => symbol.components.join()).join(' | ')
  }

  setSymbol(symbol: SymbolQuery, activeSymbolIndex: number) {
    if (activeSymbolIndex >= this.activeSymbols.length)
      throw new Error(`Symbol index ${activeSymbolIndex} out of range for clan: ${this.clan}`);
    this.activeSymbols[activeSymbolIndex] = symbol;
  }
}

export function getPlausibleSyllables(parts: string[], symbolType: SymbolType): string[] {
  let plausibleSyllables: string[];
  if (symbolType === 'prefix') {
    plausibleSyllables = prefixes;
  } else if (symbolType === 'suffix') {
    plausibleSyllables = suffixes;
  } else {
    plausibleSyllables = [...prefixes, ...suffixes];
  }
  const possibilitiesByPart = parts.map((partId) => partParents[partId]);
  plausibleSyllables = intersection(plausibleSyllables, ...possibilitiesByPart);
  return plausibleSyllables;
}

export function getPlausibleNewParts(parts: string[], symbolType: SymbolType): string[] {
  const syllables: string[] = getPlausibleSyllables(parts, symbolType);
  let plausibleParts = uniq(syllables.map((syllable) => symbolDefs[syllable]).flat());
  return without(plausibleParts, ...parts);
}

export function filterPlausibleParts(parts: string[], symbolType: SymbolType, newParts: string[]): string[] {
  const plausibleParts = getPlausibleNewParts(parts, symbolType);
  return intersection(newParts, plausibleParts);
}

export function arePartsPlausible(parts: string[], symbolType: SymbolType, newParts: string[]): boolean {
  return filterPlausibleParts(parts, symbolType, newParts).length > 0;
}

function hasComplement(partId: string): boolean {
  const secondToLastChar = partId.slice(-2)[0];
  return partId[0] === 'c' && (secondToLastChar === 'm' || secondToLastChar === 'l');
}

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

export function filterPartsByGeon(parts: string[], geon: Geon): string[] {
  if (['gq1', 'gbs'].includes(geon)) {
    parts = without(parts, 'ctr2mb', 'ctr2lf', 'atrf2', 'atra2', 'atrb2');
  } else {
    parts = without(parts, 'ctr3mf', 'ctr3lb');
  }
  if (['gq2', 'gfs'].includes(geon)) {
    parts = without(parts, 'ctl3mb', 'ctl3lf', 'ctl2mb', 'ctl2lf', 'atlf2', 'atla2', 'atlb2');
  } else {
    parts = without(parts, 'ctl3mf', 'ctl3lb');
  }
  if (['gq3', 'gbs'].includes(geon)) {
    parts = without(parts, 'cbl3mb', 'cbl3lf', 'cbl2mb', 'cbl2lf', 'ablf2', 'ablb2');
  } else {
    parts = without(parts, 'cbl3mf', 'cbl3lb');
  }
  if (['gq4', 'gfs'].includes(geon)) {
    parts = without(parts, 'cbr2mb', 'cbr2lf', 'abrf2', 'abrb2', 'arb2');
  }
  return parts;
}

export class SymbolQuery {
  sigilQuery?: SigilQuery;
  symbolType: SymbolType;
  components: string[];

  constructor(sigilQuery: SigilQuery = undefined, components = [], symbolType: SymbolType = 'suffix') {
    this.sigilQuery = sigilQuery;
    this.components = components;
    this.symbolType = symbolType;
    this.cleanupParts();
  }

  set geon(geon: Geon) {
    this.components = this.components.filter(c => c[0] !== 'g');
    if (geon)
      this.components = [geon, ...this.components];
    this.cleanupParts();
  }

  get geon(): Geon {
    return this.components.find(c => c[0] === 'g');
  }

  get allowFictional() {
    if (this.sigilQuery) return this.sigilQuery.allowFictional;
    return true;
  }

  get plausibleSyllables() {
    return getPlausibleSyllables(this.components, this.symbolType);
  }

  get isPlausible() {
    return this.plausibleSyllables.length > 0;
  }

  get plausibleParts() {
    return getPlausibleNewParts(this.components, this.symbolType);
  }

  filterPlausibleParts(parts: string[]): string[] {
    return filterPlausibleParts(this.components, this.symbolType, parts);
  }

  arePartsPlausible(parts: string[]): boolean {
    return arePartsPlausible(this.components, this.symbolType, parts);
  }

  cleanupParts() {
    this.components = uniq(this.components);
    this.components = filterPartsByGeon(this.components, this.geon);
    // if (!this.allowFictional) {
    //   this.components = this.plausibleParts;
    // }
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
    if (hasComplement(partId)) {
      const otherPartId = getComplementaryCircleId(partId);
      this.components = [...this.components, otherPartId];
    }
    this.cleanupParts();
    return this;
  }

  removePart(partId: string) {
    this.components = without(this.components, partId);
    if (hasComplement(partId)) {
      const otherPartId = getComplementaryCircleId(partId);
      this.components = without(this.components, otherPartId);
    }
    this.cleanupParts();
    return this;
  }
}

export function getDeepParts(def: ModeDef): string[] {
  if (def.modes) {
    return uniq(Object.values(def.modes).map(getDeepParts).flat());
  } else {
    return def.parts || [];
  }
}
