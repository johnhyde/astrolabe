import type { ConnectionStatus } from './connection';
import type { Patp, Group, Contact, Rolodex } from '@urbit/api';
export interface Contacts {
  [contact: string]: Contact;
};

export interface Docs {
  [doc: string]: string;
};

export interface PalNames {
  [patp: Patp]: boolean;
}

export interface Pal {
  tags: string[];
  ack: boolean;
}

export interface PalList {
  [patp: Patp]: Pal;
}

export interface Pals {
  incoming: PalNames;
  outgoing: PalList;
  mutuals: PalList;
}

export const PAL_STATUSES = ['mutual', 'outgoing', 'incoming', 'unconnected'] as const;
export type PalStatus = typeof PAL_STATUSES[number];
export interface PalInfo extends Pal {
  patp: Patp;
  status: PalStatus;
}

export interface StoreState {
  // Urbit
  // groups: {
  //   [group: string]: Group;
  // };
  contacts: Rolodex;
  peers: Patp[];
  pals: Pals;
  palsInstalled: boolean;
  patpQuery: RegExp;
  sigilQuery: string[][];
  searchMode: ('patp' | 'sigil');
  // contacts: Contacts;
  // contactSearchResults: Contacts;
  // chats: [];
  connection: ConnectionStatus;
  subscription?: unknown;
  ship: Patp;
}
export type SearchedContactsState = Rolodex;

export class SearchSettings {
  includeMoons: boolean = true;
  includeComets: boolean = false;

  allowFictionalSigils: boolean = false;
}
