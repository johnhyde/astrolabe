import { writable } from 'svelte/store';

import api from '../lib/api';
import type { StoreState, Contacts } from '../types/store';
import { filterObject } from '../lib/utils';
import fakeContacts from '../fake_data/fake-contacts';

const initStore: StoreState = {
  // chats: [],
  // groups: {},
  contacts: {},
  connection: 'disconnected',
  ship: window.ship,
  docs: {},
};

const store = writable(initStore);
const { subscribe, update, set } = store;

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
    }) as Contacts;
    return {
      ...$store,
      contacts: filteredContacts,
    }
  });
}

function reset() {
  set(initStore);
}

function getDoc(path) {
  return new Promise((resolve, reject) => {
    const unsubscribe = subscribe(async ({ docs }) => {
      try {
        if (docs[path]) {
          resolve(docs[path]);
        } else {
          const doc = await api.scry<string>({ app: 'astrolabe', path: `/doc/${path}` });
          update(($store: StoreState): StoreState => {
            return {
              ...$store,
              docs: {
                ...$store.docs,
                [path]: doc,
              },
            }
          });
          resolve(doc);
        }
      } catch (error) {
        reject(error);
      }
    });
    unsubscribe();
  });
}


export default { subscribe, search, reset, getDoc };