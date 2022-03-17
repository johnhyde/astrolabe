function filterObject(obj, predicate) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key, value)));
}

export {
  filterObject,
}