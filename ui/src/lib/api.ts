import UrbitApi from '@urbit/http-api';
import type { ContactUpdate, Patp, Group, Contact, Rolodex } from '@urbit/api';
import _get from 'lodash/get';
import { compose } from 'lodash/fp';

import { normalizeId } from './id';

console.log(`Initializing Urbit API at ${Date()}`);
const api: UrbitApi = new UrbitApi('', '', window.desk);
api.ship = window.ship;
// api.connect();

export { api };

export function scry<T = any>(path: string): Promise<T> {
  return api.scry<T>({ app: 'astrolabe', path });
}

export function getPoint(patp: string): Promise<any> {
  return scry<any>(`/point/${patp}`);
}

export function getSpawnedPoints(patp: string): Promise<any> {
  return scry<any>(`/point/${patp}/spawned`);
}

export function getLockedSpawnedPoints(patp: string): Promise<any> {
  return scry<any>(`/point/${patp}/spawned/locked`);
}

export function getUnlockedSpawnedPoints(patp: string): Promise<any> {
  return scry<any>(`/point/${patp}/spawned/unlocked`);
}

export function getPeers(): Promise<any> {
  return scry<any>(`/peers`);
}

export async function searchPoints(search: string, mode: ('patp' | 'sigil')): Promise<Patp[]> {
  const { points } = await scry<any>(`/search/${mode}/${search}`);
  return points.map(normalizeId);
}

export function getChartData(old = false): Promise<any> {
  return scry<any>('/chart-data' + (old ? '-old' : ''));
}

window['gcd'] = getChartData;

export function getDoc(path: string): Promise<string> {
  return scry<string>(`/doc/${path}`);
}

export function initialContacts(json: ContactUpdate, contacts: Rolodex): Rolodex {
  const data = _get(json, 'initial', false);
  if (data) {
    contacts = data.rolodex;
  }
  return contacts;
};

export function  addContact(json: ContactUpdate, contacts: Rolodex): Rolodex {
  const data = _get(json, 'add', false);
  if (data) {
    contacts[data.ship] = data.contact;
  }
  return contacts;
};

export function removeContact(json: ContactUpdate, contacts: Rolodex): Rolodex {
  const data = _get(json, 'remove', false);
  if (
    data &&
    (data.ship in contacts)
  ) {
    delete contacts[data.ship];
  }
  return contacts;
};

export function handleContactUpdateEvent(updateContacts) {
  return ({ 'contact-update': contactUpdate }) => {
    console.log(`received contact-update: ${Object.keys(contactUpdate)}`)
    const reducers = [initialContacts, addContact, removeContact];
    const reducer = compose(reducers.map(r => sta => r(contactUpdate, sta)));
    updateContacts(reducer);
  };
}

export function subscribeToContacts(e: (data: any) => void): Promise<any> {
  return api.subscribe({
    app: 'contact-store',
    path: '/all',
    event: handleContactUpdateEvent(e),
    err: () => {
      console.error(`Subscription to contact-store/all just get "err"`);
    },
    quit: () => {
      console.error(`Subscription to contact-store/all just get "quit"`);
    }
  })
}

export function handleGoraInit(patp: Patp, updateGora) {
  return (newGorae) => {
    console.log('just got new gorae');
    console.log(newGorae);
    // console.log(`received contact-update: ${Object.keys(contactUpdate)}`)
    // const reducers = [initialContacts, addContact, removeContact];
    // const reducer = compose(reducers.map(r => sta => r(contactUpdate, sta)));
    updateGora(patp, newGorae);
  };
}

export function subscribeToGorae(patp: Patp, e: (patp: string, gorae: string[]) => void): Promise<any> {
  let path = '/gorae/' + normalizeId(patp);
  return api.subscribe({
    app: 'astrolabe',
    path: '/gorae/' + normalizeId(patp),
    event: handleGoraInit(patp, e),
    err: () => {
      console.error(`Subscription to /astrolabe/${path} just got "err"`);
    },
    quit: () => {
      console.error(`Subscription to /astrolabe/${path} just got "quit"`);
    }
  })
}
