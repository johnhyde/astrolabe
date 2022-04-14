import { writable } from 'svelte/store';

import api from '../lib/api';
const docs = {};
// import type { AppState, Contacts } from '../types/store';

const initStore: any = {
  show: false,
  path: '',
};

const store = writable(initStore);
const { subscribe, update, set } = store;

async function getDoc(path): Promise<string> {
  if (docs[path]) {
    return docs[path];
  } else {
    const doc = await api.scry<string>({ app: 'astrolabe', path: `/doc/${path}` });
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


export default { subscribe, getDoc, show, hide };