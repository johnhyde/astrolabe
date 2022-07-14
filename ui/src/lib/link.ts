import { buildQuerystring } from './utils';

export function linkToShip(patp: string, queryParams = {}): string {
  return `/ship/${patp}` + buildQuerystring(queryParams);
}

export function linkToChart(patp: string): string {
  if (patp) {
   return `/chart/${patp}`;
  }
  return `/chart`;
}
