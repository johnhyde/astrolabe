export function isStringNaN(value: string): boolean {
  return window.isNaN(value as any) || Number.isNaN(parseInt(value)) || !(/^-?\d+$/.test(value));
}

export function listStrings(list: string[], includeAnd: boolean = false): string {
  if (includeAnd && list.length > 1) {
    return listStrings(list.slice(0, -1)) + ' and ' + listStrings(list.slice(-1));
  }
  return "'" + list.join("', '") + "'";
}

export function filterObject(obj, predicate) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key, value)));
}

export function buildQuerystring(data) {
	if (typeof (data) === 'string') return data;

	var query = [];
	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			// Encode each key and value, concatenate them into a string, and push them to the array
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
	}

	// Join each item in the array with a `&` and return the resulting string
	return query.length ? '?' + query.join('&') : '';
}

export function setStoreKey(store, key, value) {
  store.update((store) => ({
    ...store,
    [key]: value,
  }));
}

export function toggleStoreKey(store, key) {
  store.update((store) => ({
    ...store,
    [key]: !store[key],
  }));
}

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function uxToHex(ux: string) {
  let value = ux;
  if (ux.length > 2 && ux.substring(0, 2) === '0x') {
    value = ux.substring(2)
  }

  value = value.replace('.', '').padStart(6, '0');
  return '#' + value;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
