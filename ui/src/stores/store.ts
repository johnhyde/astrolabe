import { writable } from 'svelte/store';

import type { Rolodex } from '@urbit/api';
import { subscribeToContacts, getPeers, subscribeToGorae } from 'lib/api';
import type { StoreState, Apps, Gorae } from 'types/store';
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
  gorae: {},
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

function updateGorae(patp: string, gorae: string[]): void {
  update($store => {
    return {
      ...$store,
      gorae: {
        ...$store.gorae,
        [patp]: gorae || ['nope.jpg'],
      },
    };
  });
}

function getGorae(patp: string) {
  subscribeToGorae(patp, updateGorae);
}


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

export default { subscribe, set, searchPatp, searchSigil, refreshPals, getGorae, reset };
