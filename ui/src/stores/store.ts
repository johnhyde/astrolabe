import { writable } from 'svelte/store';

import type { ContactUpdate, Patp, Group, Contact, Rolodex } from '@urbit/api';
import { subscribeToContacts } from '../lib/api';
import type { StoreState, Contacts } from '../types/store';
import { filterObject } from '../lib/utils';
import fakeContacts from '../fake_data/fake-contacts';

const initStore: StoreState = {
  // chats: [],
  // groups: {},
  contacts: {},
  contactSearchResults: {},
  connection: 'disconnected',
  ship: window.ship,
};

const store = writable(initStore);
const { subscribe, update, set } = store;

function search(idQuery: RegExp) {
  update(($store: StoreState): StoreState => {
    if (!idQuery) {
      return {
        ...$store,
        contactSearchResults: $store.contacts,
      };
    }
    // const filteredContacts = filterObject($store.contacts, (id, contact) => {
    const filteredContacts = filterObject($store.contacts, (id) => {
      return idQuery.test(id);
    }) as Contacts;
    return {
      ...$store,
      contactSearchResults: filteredContacts,
    }
  });
}

function reset() {
  set(initStore);
}

function updateContacts(callback: (contacts: Rolodex) => Rolodex): void {
  update($store => {
    return {
      ...$store,
      contacts: callback($store.contacts),
    };
  });
}

// setTimeout(() => {
  subscribeToContacts(updateContacts);
// }, 1000);


export default { subscribe, search, reset };