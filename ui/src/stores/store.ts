import { writable } from 'svelte/store';
import type { StoreState } from '../types/store';
import { filterObject } from '../lib/utils';
import fakeContacts from '../fake_data/fake-contacts';

const initStore: StoreState = {
  // chats: [],
  // groups: {},
  contacts: {},
  connection: 'disconnected',
  ship: window.ship,
};

const { subscribe, update, set } = writable(initStore);

function search(idQuery: RegExp) {
  update(($store: StoreState): StoreState => {
    if (!idQuery) {
      return {
        ...$store,
        contacts: fakeContacts,
      };
    }
    // const filteredContacts = filterObject($store.contacts, (id, contact) => {
    const filteredContacts = filterObject(fakeContacts, (id) => {
      return idQuery.test(id);
    });
    return {
      ...$store,
      contacts: filteredContacts,
    }
  });
}

function reset() {
  set(initStore);
}


export default { subscribe, search, reset };