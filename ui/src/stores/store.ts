import { writable } from 'svelte/store';

import type { Rolodex } from '@urbit/api';
import { subscribeToContacts, getPeers } from 'lib/api';
import type { StoreState } from 'types/store';
import {  normalizeId } from 'lib/id';
import {  setStoreKey } from 'lib/utils';

const initStore: StoreState = {
  contacts: {},
  peers: {},
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

getPeers().then(({ points }) => {
  setStoreKey(store, 'peers', points.map(normalizeId));
});

export default { subscribe, set, search, reset };