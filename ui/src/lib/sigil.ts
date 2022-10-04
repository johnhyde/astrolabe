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
        // symbol.components = ['gci', 'lhf'];
      } else {
        symbol.symbolType = 'suffix';
        // symbol.components = ['gsq', 'atrf4'];
      }
    });
    this.symbols = this.symbols;
  }

  clearSymbols() {
    this.symbols = [];
    this.padSymbols();
    return this;
  }

  get activeSymbols() {
    if (this.clan === 'galaxy')
      return [this.symbols[1]];
    if (this.clan === 'star')
      return this.symbols.slice(0, 2);
    return this.symbols;
  }

  get isPlausible() {
    return this.activeSymbols.every(symbol => symbol.isPlausible);
  }

  get queryParts(): string[][] {
    return this.activeSymbols.map(symbol => symbol.components);
  }

  get querySyls(): string[][] {
    return this.activeSymbols.map(symbol => symbol.plausibleSyllables);
  }

  get queryInts(): number[][] {
    let ints = this.activeSymbols.map(symbol => symbol.plausibleInts);
    if (ints.length > 1) {
      ints[0] = without(ints[0], 0);
    }
    return ints;
  }

  get isDefinitive() {
    return this.querySyls.every(syls => syls.length === 1);
  }

  get isNotEmpty() {
    return this.activeSymbols.some(symbol => symbol.components.length > 0);
  }

  get isWorthSearching() {
    if (!this.isNotEmpty) return false; // 🙃
    if (!this.isPlausible) return false;
    return true;
  }

  get string(): string {
    return this.queryInts.map((int) => int.length == 256 ? 'any' : int.join('.')).join('_');
  }
  
  get urlString(): string {
    return this.queryParts.map(parts => parts.join('.')).join('_');
  }

  set urlString(str: string) {
    if (!str) return;
    const queryParts = str.split('_').map(sym => sym.split('.').filter(part => part !== ''));
    switch (queryParts.length) {
      case 1:
        this.clan = 'galaxy';
        break;
      case 2:
        this.clan = 'star';
        break;
      case 4:
        this.clan = 'planet';
        break;
      default:
        return;
    }
    let symbols;
    try {
      symbols = queryParts.map((parts) => {
        let symbol = new SymbolQuery(this, parts);
        if (symbol.components.length !== parts.length) {
          throw new Error(`Invalid component ids: ${without(parts, ...symbol.components)}`);
        }
      });
    } catch (e) {
      console.error("Couldn't load in sigil query text", e);
      this.clan = 'planet';
      symbols = [];
    }
    this.padSymbols();
  }

  get patp(): string {
    if (!this.isDefinitive) return '';
    const querySyls = this.querySyls.flat();
    let patp = '~' + querySyls[0];
    if (querySyls.length > 1) {
      patp += querySyls[1];
      if (querySyls.length > 2) {
        patp += '-' + querySyls[2] + querySyls[3];
      }
    }
    return patp;
  }

  setSymbol(symbol: SymbolQuery, activeSymbolIndex: number) {
    if (activeSymbolIndex >= this.activeSymbols.length)
      throw new Error(`Symbol index ${activeSymbolIndex} out of range for clan: ${this.clan}`);
    this.activeSymbols[activeSymbolIndex] = symbol;
  }
}

const equivalentParts = {
  lfhb: 'lfhbm',
  lfhbm: 'lfhb',
  atlf2: 'atlf2l',
  atlf2l: 'atlf2',
  atlf4: 'atlf4l',
  atlf4l: 'atlf4',
  atlf6: 'atlf6l',
  atlf6l: 'atlf6',
}

function addEquivalentParts(parts: string[]): string[] {
  const moreParts = parts.map(partId => equivalentParts[partId]).filter(part => part);
  return [...parts, ...moreParts];
}

function getSyllablesBySymbolType(symbolType: SymbolType): string[] {
  if (symbolType === 'prefix') {
    return prefixes;
  } else if (symbolType === 'suffix') {
    return suffixes;
  } else {
    return [...prefixes, ...suffixes];
  }
}

export function getPlausibleSyllables(parts: string[], symbolType: SymbolType): string[] {
  let plausibleSyllables = getSyllablesBySymbolType(symbolType);
  const possibilitiesByPart = parts.map((partId) => {
    let parents = partParents[partId];
    const otherPart = equivalentParts[partId];
    if (otherPart) {
      parents = [...parents, ...partParents[otherPart]];
    }
    return parents;
  });
  plausibleSyllables = intersection(plausibleSyllables, ...possibilitiesByPart);
  return plausibleSyllables;
}

function convertSyllableToInt(syl: string, symbolType: SymbolType): number {
  let syls = getSyllablesBySymbolType(symbolType);
  return syls.findIndex(s => s === syl) % 256;
}

export function getPlausibleNewParts(parts: string[], symbolType: SymbolType): string[] {
  const syllables: string[] = getPlausibleSyllables(parts, symbolType);
  let plausibleParts = uniq(syllables.map((syllable) => symbolDefs[syllable]).flat());
  plausibleParts = addEquivalentParts(plausibleParts);
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

export function filterFakeParts(parts: string[]): string[] {
  return parts.filter(part => partParents[part]);
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

  get plausibleInts() {
    return this.plausibleSyllables.map(syl => convertSyllableToInt(syl, this.symbolType));
  }

  get isPlausible() {
    return this.plausibleSyllables.length > 0;
  }

  get plausibleParts() {
    return getPlausibleNewParts(this.components, this.symbolType);
  }

  get isPerfectMatch() {
    const syls = this.plausibleSyllables;
    if (syls.length === 1) return true;
    const compLength = this.components.length;
    return syls.map(syl => symbolDefs[syl].length).some(length => length === compLength);
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
    this.components = filterFakeParts(this.components);
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

  clearExceptPartType(partType: PartType) {
    this.components = this.components.filter(c => c[0] === partType[0]);
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
