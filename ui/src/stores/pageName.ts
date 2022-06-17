import { writable } from 'svelte/store';

const initial = null;

const store = writable(initial);
const { subscribe, update, set } = store;

function reset() {
  set(initial);
}

export default { subscribe, update, set, reset };
