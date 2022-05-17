import { buildQuerystring } from './utils';

export function linkToShip(patp: string, queryParams = {}): string {
  return `/ship/${patp}` + buildQuerystring(queryParams);
}
