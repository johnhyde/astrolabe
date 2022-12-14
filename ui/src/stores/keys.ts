import { writable, get } from 'svelte/store';

const docs = {};

class MapWithDefault<K, V> extends Map<K, V> {
  default: Function;

  get(key: K) {
    if (!this.has(key)) {
      this.set(key, this.default());
    }
    return super.get(key);
  }
  
  constructor(defaultFunction: () => V) {
    super();
    this.default = defaultFunction;
  }
}

type Bindings = MapWithDefault<string, MapWithDefault<string, Function>>;
interface KeysStore {
  keydown: Bindings;
  keyup: Bindings;
  globalkeydown: Bindings;
  globalkeyup: Bindings;
};
function newEmptyBindings(): Bindings {
  return new MapWithDefault(() => new MapWithDefault(() => Function));
}
const initStore: KeysStore = {
  keydown: newEmptyBindings(),
  keyup: newEmptyBindings(),
  globalkeydown: newEmptyBindings(),
  globalkeyup: newEmptyBindings(),
};

const store = writable(initStore);
const { subscribe, update, set } = store;

function runCallbacks(bindings: Bindings, event: KeyboardEvent) {
  let els = [];
  if (event.ctrlKey) els.push('ctrl');
  if (event.metaKey) els.push('cmd');
  if (event.altKey) els.push('alt');
  if (event.shiftKey) els.push('shift');
  els.push(event.key == ' ' ? 'Space' : event.key.toLowerCase());
  let combo = els.join('+');
  // console.log(event);
  let callbacks = bindings.get(combo);
  if (callbacks) {
    callbacks.forEach((callback) => {
      try {
        if (callback)
          callback(event);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export default {
  subscribe,
  update,
  set,
  runCallbacks,
};
