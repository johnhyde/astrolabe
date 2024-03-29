import { writable } from 'svelte/store';

import type { Rolodex } from '@urbit/api';
import { subscribeToContacts, getPeers } from 'lib/api';
import type { StoreState, Apps } from 'types/store';
import { normalizeId } from 'lib/id';
import { setStoreKey } from 'lib/utils';
import { getPals } from 'lib/pals';
import { subscribeToApps } from 'lib/apps';

const initStore: StoreState = {
  contacts: {},
  peers: [],
  pals: {
    incoming: {},
    outgoing: {},
    mutuals: {},
  },
  palsInstalled: false,
  apps: {
    allies: {},
    set: new Set(),
  },
  patpQuery: null,
  sigilQuery: null,
  searchMode: 'patp',
  connection: 'disconnected',
  ship: window.ship,
};

const store = writable(initStore);
const { subscribe, update, set } = store;

function searchPatp(patpQuery: RegExp) {
  setStoreKey(store, 'patpQuery', patpQuery);
  setStoreKey(store, 'searchMode', 'patp');
}

function searchSigil(syls: string[][]) {
  setStoreKey(store, 'sigilQuery', syls);
  setStoreKey(store, 'searchMode', 'sigil');
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

function refreshPals() {
  return getPals().then((pals) => {
    setStoreKey(store, 'pals', pals);
    setStoreKey(store, 'palsInstalled', true);
  });
}
refreshPals();

function updateApps(callback: (apps) => Apps): void {
  update($store => {
    return {
      ...$store,
      apps: callback($store.apps),
    };
  });
}

subscribeToApps(updateApps);

export default { subscribe, set, searchPatp, searchSigil, refreshPals, reset };
