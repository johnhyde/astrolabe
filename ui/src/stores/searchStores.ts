import { writable, derived } from 'svelte/store';

import type { Contact, Rolodex } from '@urbit/api';
import store from './store';
import type { StoreState, SearchedContactsState } from 'types/store';
import { SearchSettings } from 'types/store';
import { splitIdIntoSyls } from 'lib/id';
import { filterObject } from 'lib/utils';

const searchSettings = writable(new SearchSettings());

const searchedContacts = derived([store, searchSettings], deriveSearchedContacts);
searchedContacts.searchPatp = store.searchPatp;
searchedContacts.searchSigil = store.searchSigil;

function deriveSearchedContacts([$store, $searchSettings]): SearchedContactsState {
  let idMatches;
  if ($store.searchMode === 'patp') {
    if (!$store.patpQuery) {
      return {};
    }
    idMatches = idMatchesRegex;
  } else {
    if (!$store.sigilQuery) {
      return {};
    }
    idMatches = idMatchesSyls;
  }
  function isIdAllowed(id) {
    if (!$searchSettings.includeMoons && id.length > 14 && id.length <= 28) {
      return false;
    }
    if (!$searchSettings.includeComets && id.length > 28) {
      return false;
    }
    return true;
  }
  function idMatchesSyls(id) {
    if (!isIdAllowed(id)) return false;
    const idSyls = splitIdIntoSyls(id);
    if (idSyls.length !== $store.sigilQuery.length) return false;
    return idSyls.every((syl, index) => {
      const symbolSyls = $store.sigilQuery[index];
      if (symbolSyls.length == 256) return true;
      return symbolSyls.includes(syl);
    });
  }
  function idMatchesRegex(id) {
    if (!$store.patpQuery.test(id)) return false;
    return isIdAllowed(id);
  }
  const filteredContacts = filterObject($store.contacts, idMatches) as Rolodex;
  $store.peers.forEach((id) => {
    if (idMatches(id) && !filteredContacts[id]) {
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
