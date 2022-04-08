import type { ConnectionStatus } from './connection';
import type { Patp, Group, Contact } from '@urbit/api';
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
  contacts: Contacts;
  // chats: [];
  connection: ConnectionStatus;
  subscription?: unknown;
  ship: Patp;
  docs: Docs;
}
