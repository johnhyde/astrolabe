function listStrings(list: string[], includeAnd: boolean = false): string {
  if (includeAnd && list.length > 1) {
    return listStrings(list.slice(0, -1)) + ' and ' + listStrings(list.slice(-1));
  }
  return "'" + list.join("', '") + "'";
}

function filterObject(obj, predicate) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key, value)));
}

export {
  listStrings,
  filterObject,
}