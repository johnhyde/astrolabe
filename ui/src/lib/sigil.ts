import type { Clan } from 'types/sigil';
import { SymbolQuery } from 'types/sigil';

export class SigilQuery {
  clan: Clan;
  symbols: SymbolQuery[];

  constructor(clan: Clan = 'planet', symbols = []) {
    this.clan = clan;
    this.symbols = symbols;
    this.padSymbols();
  }

  padSymbols() {
    if (this.symbols.length === 1) {
      this.symbols.unshift(new SymbolQuery());
    }
    while (this.symbols.length < 4) {
      this.symbols.push(new SymbolQuery());
    }
    this.symbols = this.symbols.slice(0, 4);
    this.symbols.forEach((symbol, i) => {
      if (i % 2 === 0) {
        symbol.symbolType = 'prefix';
        // symbol.components = ['gci', 'abr622']
      } else {
        symbol.symbolType = 'suffix';
        symbol.components = ['gsq', 'abl202']
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

  get string(): string {
    return this.symbols.map((symbol) => symbol.components.join()).join(' | ')
  }

  setSymbol(symbol: SymbolQuery, activeSymbolIndex: number) {
    if (activeSymbolIndex >= this.activeSymbols.length)
      throw new Error(`Symbol index ${activeSymbolIndex} out of range for clan: ${this.clan}`);
    this.activeSymbols[activeSymbolIndex] = symbol;
  }
}

export function sigilScalingFunction(size: number): number {
  return 3.5 * Math.sqrt(51 / size);
}
