import _get from 'lodash/get';
import { compose } from 'lodash/fp';
import type { Apps } from 'types/store';
import store from 'stores/store';
import { sleep } from 'lib/utils';
import { api } from 'lib/api';
import { normalizeId } from 'lib/id';

export function getProvidedApps(patp: string): Promise<any> {
  return api.scry<any>({ app: 'treaty', path: `/treaties/${patp}` });
}

// Unused, use subscription
export function getKnownApps(): Promise<any> {
  return api.scry<any>({ app: 'treaty', path: `/allies` }).then(processAllies);
}

export function getApp(ship: string, desk: string): Promise<any> {
  return getAppByPath(`${normalizeId(ship)}/${desk}`);
}

// @param path - ship/desk e.g. ~mister-dister-dozzod-dozzod/webterm
export async function getAppByPath(path: string, retry: number = 2): Promise<any> {
  try {
    return await api.scry<any>({ app: 'treaty', path: `/treaty/${path}` });
  } catch {
    if (retry > 0) {
      console.log(`Got error when fetching app: ${path}.\nTrying at most ${retry} more time(s)`);
      await sleep(750);
      return getAppByPath(path, retry - 1);
    }
  }
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
  return results;
}

export async function delAllies(ships: string[], retry: number = 0) {
  let results = await Promise.allSettled(ships.map((ship: string) => {
    return delAlly(normalizeId(ship));
  }));
  results = results.filter(r => r.status === 'fulfilled').map((r) => {
    return (r as PromiseFulfilledResult<any>).value;
  });
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

export type AllyUpdate = AllyUpdateIni | AllyUpdateAdd | AllyUpdateDel | AllyUpdateNew;

export interface AllyUpdateIni {
  ini: {
    [ship: string]: string[];
  }
}

export interface AllyUpdateNew {
  new: {
    ship: string;
    alliance: string[];
  }
}

export interface AllyUpdateAdd {
  add: string;
}

export interface AllyUpdateDel {
  del: string;
}

export function handleAllyUpdateIni(json: AllyUpdate, apps: Apps): Apps {
  const data = _get(json, 'ini', false);
  if (data) {
    apps = processAllies(json)
  }
  return apps;
};

export function handleAllyUpdateNew(json: AllyUpdate, apps: Apps): Apps {
  const data = _get(json, 'new', false);
  if (data) {
    apps = processAllies({
      ini: {
        ...apps.allies,
        [data.ship]: data.alliance,
      }
    });
  }
  return apps;
};

export function handleAllyUpdateAdd(json: AllyUpdate, apps: Apps): Apps {
  const data = _get(json, 'add', false);
  if (data) {
    apps = processAllies({
      ini: {
        ...apps.allies,
        [data]: [],
      }
    });
  }
  return apps;
};

export function handleAllyUpdateDel(json: AllyUpdate, apps: Apps): Apps {
  const data = _get(json, 'del', false);
  if (data && (data in apps.allies)) {
    delete apps.allies[data];
    apps = processAllies({
      ini: apps.allies,
    });
  }
  return apps;
};

export function handleAllyUpdateEvent(updateApps) {
  return (allyUpdate: AllyUpdate) => {
    console.log(`received ally-update: ${Object.keys(allyUpdate)}`);
    const reducers = [handleAllyUpdateIni, handleAllyUpdateNew, handleAllyUpdateAdd, handleAllyUpdateDel];
    const reducer = compose(reducers.map(r => sta => r(allyUpdate, sta)));
    updateApps(reducer);
  };
}

export function subscribeToApps(e: (data: any) => void): Promise<any> {
  return api.subscribe({
    app: 'treaty',
    path: '/allies',
    event: handleAllyUpdateEvent(e),
    err: () => {
      console.error(`Subscription to treaty/all just got "err"`);
    },
    quit: () => {
      console.error(`Subscription to treaty/all just got "quit"`);
    }
  })
}
