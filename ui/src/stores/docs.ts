import { writable } from 'svelte/store';

import { getDoc } from 'lib/api';
const docs = {};
// import type { AppState, Contacts } from 'types/store';

const initStore: any = {
  show: false,
  path: '',
};

const store = writable(initStore);
const { subscribe, update, set } = store;

async function getCachedDoc(path): Promise<string> {
  if (docs[path]) {
    return docs[path];
  } else {
    const doc = await getDoc(path);
    docs[path] = doc;
    return doc;
  }
}

function show(path) {
  update($store => ({
    ...$store,
    path,
    show: true,
  }));
}

function hide() {
  update($store => ({
    ...$store,
    show: false,
  }));
}

export default {
  subscribe,
  getDoc: getCachedDoc,
  show,
  hide
};
