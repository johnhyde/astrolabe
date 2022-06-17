import { writable } from 'svelte/store';

import type { Rolodex } from '@urbit/api';
import { subscribeToContacts } from '../lib/api';
import type { StoreState } from '../types/store';
import {  setStoreKey } from '../lib/utils';

const initStore: StoreState = {
  contacts: {},
  query: null,
  connection: 'disconnected',
  ship: window.ship,
};

const store = writable(initStore);
const { subscribe, update, set } = store;

function search(idQuery: RegExp) {
  setStoreKey(store, 'query', idQuery);
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

subscribeToContacts(updateContacts);

export default { subscribe, set, search, reset };