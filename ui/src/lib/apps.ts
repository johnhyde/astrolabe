import type { Apps } from 'types/store';
import store from 'stores/store';
import { api } from 'lib/api';
import { normalizeId } from 'lib/id';

export function getProvidedApps(patp: string): Promise<any> {
  return api.scry<any>({ app: 'treaty', path: `/treaties/${patp}` });
}

export function getKnownApps(): Promise<any> {
  return api.scry<any>({ app: 'treaty', path: `/allies` }).then(processAllies);
}

export function getApp(ship: string, desk: string): Promise<any> {
  return api.scry<any>({ app: 'treaty', path: `/treaty/${normalizeId(ship)}/${desk}` });
}

// @param path - ship/desk e.g. ~mister-dister-dozzod-dozzod/webterm
export function getAppByPath(path: string): Promise<any> {
  return api.scry<any>({ app: 'treaty', path: `/treaty/${path}` });
}

export function getInstalledApps(): Promise<any> {
  return api.scry<any>({ app: 'docket', path: `/charges` });
}

export async function sendAllyUpdate(cmd: string, ship: string) {
  let result = await api.poke({
    app: 'treaty',
    mark: 'ally-update-0',
    json: { [cmd]: normalizeId(ship) },
  });
  // store.refreshKnownApps();
  return result;
}

export function addAlly(patp: string) {
  return sendAllyUpdate('add', patp);
}

export function delAlly(patp: string) {
  return sendAllyUpdate('del', patp);
}

export async function addAllies(ships: string[]) {
  let results = await Promise.allSettled(ships.map((ship: string) => {
    return addAlly(normalizeId(ship));
  }));
  results = results.filter(r => r.status === 'fulfilled').map((r) => {
    return (r as PromiseFulfilledResult<any>).value;
  });
  store.refreshKnownApps();
  return results;
}

export async function delAllies(ships: string[], retry: number = 0) {
  let results = await Promise.allSettled(ships.map((ship: string) => {
    return delAlly(normalizeId(ship));
  }));
  results = results.filter(r => r.status === 'fulfilled').map((r) => {
    return (r as PromiseFulfilledResult<any>).value;
  });
  store.refreshKnownApps();
  return results;
}

export function processAllies(rawPals: any): Apps {
  let allies = rawPals.ini;
  let paths = Object.values(allies).flat() as string[];
  let set = new Set(paths);
  return {
    allies,
    set,
  };
}
