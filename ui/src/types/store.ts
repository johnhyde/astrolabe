import type { ConnectionStatus } from './connection';
import type { Patp, Group, Contact } from '@urbit/api';

export interface StoreState {
  // Urbit
  // groups: {
  //   [group: string]: Group;
  // };
  contacts: {
    [contact: string]: Contact;
  };
  // chats: [];
  connection: ConnectionStatus;
  subscription?: unknown;
  ship: Patp;
}
