import { writable, derived } from 'svelte/store';

import type { Rolodex } from '@urbit/api';
import store from './store';
import type { StoreState, SearchedContactsState } from '../types/store';
import { SearchSettings } from '../types/store';
import { filterObject } from '../lib/utils';

const searchSettings = writable(new SearchSettings());

const searchedContacts = derived([store, searchSettings], deriveSearchedContacts);
searchedContacts.search = store.search;

function deriveSearchedContacts([$store, $searchSettings]): SearchedContactsState {
  if (!$store.query) {
    return {};
  }
  const filteredContacts = filterObject($store.contacts, (id) => {
    if (!$store.query.test(id)) return false;
    if (!$searchSettings.includeMoons && id.length > 16 && id.length <= 32) {
      return false;
    }
    if (!$searchSettings.includeComets && id.length > 32) {
      return false;
    }
    return true;
  }) as Rolodex;
  return filteredContacts;
}

export {
  // searchedContacts: { ...searchedContacts, search: store.search },
  searchedContacts,
  searchSettings,
};
