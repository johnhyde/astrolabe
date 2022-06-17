import { writable, derived } from 'svelte/store';

import type { Contact, Rolodex } from '@urbit/api';
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
  function idMatchesSearch(id) {
    if (!$store.query.test(id)) return false;
    if (!$searchSettings.includeMoons && id.length > 14 && id.length <= 28) {
      return false;
    }
    if (!$searchSettings.includeComets && id.length > 28) {
      return false;
    }
    return true;
  }
  const filteredContacts = filterObject($store.contacts, idMatchesSearch) as Rolodex;
  $store.peers.forEach((id) => {
    if (idMatchesSearch(id) && !filteredContacts[id]) {
      filteredContacts[id] = {
        nickname: null, bio: null, status: null, color: null, avatar: null,
        cover: null, groups: [], 'last-updated': 0,
      } as Contact
    }
  })
  return filteredContacts;
}

export {
  // searchedContacts: { ...searchedContacts, search: store.search },
  searchedContacts,
  searchSettings,
};
