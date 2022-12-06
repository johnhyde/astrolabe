import type { Patp } from '@urbit/api';
// import uniq from 'lodash/without';
// import without from 'lodash/without';
import type { Pals, PalList, PalNames, Pal, PalInfo, PalStatus } from 'types/store';
import store from 'stores/store';
import { api } from 'lib/api';
import { normalizeId, normalizeIdAndDesig } from 'lib/id';

export function getPals() {
  return api.scry<any>({ app: 'pals', path: '/json' }).then(processPals);
}

function palCommand(cmd: string, ship: string, tags: string[] = []) {
  return {
    [cmd]: {
      ship: normalizeIdAndDesig(ship),
      in: tags,
    },
  };
}

export async function sendPalCommand(cmd: string, ship: string, tags: string[] = []) {
  let result = await api.poke({
    app: 'pals',
    mark: 'pals-command',
    json: palCommand(cmd, ship, tags),
  });
  store.refreshPals();
  return result;
}

export function addPal(patp: string, tags: string[] = []) {
  return sendPalCommand('meet', patp, tags);
}

export function removePal(patp: string) {
  return sendPalCommand('part', patp, []);
}

export function tagPal(patp: string, tag: (string | string[])) {
  if (typeof tag == 'string') tag = [tag];
  return addPal(patp, tag);
}

export function untagPal(patp: string, tag: (string | string[])) {
  if (typeof tag == 'string') tag = [tag];
  return sendPalCommand('part', patp, tag);
}

export function processPals(rawPals: any): Pals {
  let incoming: PalNames = {};
  let outgoing: PalList = {};
  let mutuals: PalList = {};

  Object.entries(rawPals.incoming).forEach(([patp, bool]) => {
    incoming[normalizeId(patp)] = bool as boolean;
  });
  (Object.entries(rawPals.outgoing) as [string, any][]).forEach(([patp, { lists, ack }]) => {
    patp = normalizeId(patp);
    outgoing[patp] = {
      tags: lists as string[],
      ack: ack as boolean,
    };
    if (incoming[patp]) {
      mutuals[patp] = outgoing[patp];
    }
  });

  return {
    incoming,
    outgoing,
    mutuals,
  };
}

export function getPalStatus(pals: Pals, patp: Patp): PalStatus {
  if (pals.mutuals[patp]) return 'mutual';
  if (pals.outgoing[patp]) return 'outgoing';
  if (pals.incoming[patp]) return 'incoming';
  return 'unconnected';
}

export function getPal(pals: Pals, patp: Patp): PalInfo {
  return {
    patp,
    status: getPalStatus(pals, patp),
    tags: [],
    ack: null,
    ...pals.outgoing[patp],
  };
}