function isStringNaN(value: string): boolean {
  return window.isNaN(value as any) || Number.isNaN(parseInt(value)) || !(/^-?\d+$/.test(value));
}

function listStrings(list: string[], includeAnd: boolean = false): string {
  if (includeAnd && list.length > 1) {
    return listStrings(list.slice(0, -1)) + ' and ' + listStrings(list.slice(-1));
  }
  return "'" + list.join("', '") + "'";
}

function filterObject(obj, predicate) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key, value)));
}

function buildQuerystring(data) {
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

export {
  isStringNaN,
  listStrings,
  filterObject,
  buildQuerystring,
};
