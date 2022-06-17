import type { ConnectionStatus } from './connection';
import type { Patp, Group, Contact, Rolodex } from '@urbit/api';
export interface Contacts {
  [contact: string]: Contact;
};

export interface Docs {
  [doc: string]: string;
};
export interface StoreState {
  // Urbit
  // groups: {
  //   [group: string]: Group;
  // };
  contacts: Rolodex;
  query: RegExp;
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
}
