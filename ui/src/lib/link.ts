import { buildQuerystring } from './utils';

export function linkToShip(patp: string, queryParams = {}): string {
  return `/ship/${encodeURIComponent(patp)}` + buildQuerystring(queryParams);
}

export function linkToSearch(search: string, queryParams = {}): string {
  return `/search/${encodeURIComponent(search)}` + buildQuerystring(queryParams);
}

export function linkToChart(patp: string): string {
  if (patp) {
    return `/chart/${encodeURIComponent(patp)}`;
  }
  return `/chart`;
}
