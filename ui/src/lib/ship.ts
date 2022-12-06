import { clan, sein } from 'urbit-ob';

export const spawnStatusOptions = {
  unspawned: {
    text: 'unspawned',
    tooltip: 'This point has not yet been spawned by its parent',
  },
  locked: {
    text: 'locked',
    tooltip: 'This point is currently locked in a Linear Release Contract',
  },
  spawned: {
    text: 'spawned',
    tooltip: `This point has been spawned`,
  },
  spawnedNoKeys: {
    text: 'spawned (no keys set)',
    tooltip: 'This point has been spawned, but no keys have been set',
  },
};
export const layerOptions = {
  l1: {
    text: 'on layer 1',
    tooltip: 'This point is secured as an NFT on the Ethereum blockchain',
  },
  l2: {
    text: 'on layer 2',
    tooltip: `This point is secured by Urbit's "Layer 2" solution`,
  },
  spawn: {
    text: 'spawns on layer 2',
    tooltip: 'This point lives on layer 1, but it spawns new points on layer 2',
  },
};

export function generateParentChain(patp: string): any[] {
  let parents = [patp];
  let galaxyFound = false;
  let count = 10;
  while (!galaxyFound && count > 0) {
    count--;
    if (count == 0) {
      throw new Error("You've got an infinite loop in building the parent chain");
    }
    let firstItem = parents[0];
    if (clan(firstItem) == 'galaxy') {
      galaxyFound = true;
    } else {
      parents.unshift(sein(firstItem))
    }
  }
  parents.pop();
  return parents;
}

export function processPointInfo(rawPointInfo: any): any {
  let pointInfo: any = {};
  let spawnStatus: any,
    spawnedUnlocked: boolean = false,
    layer: any,
    life: number,
    rift: number,
    spawnedCount: number,
    sponsorChain: any[];
  let keysSet = false;
  if (!rawPointInfo) {
    // request pending
  } else {
    // defaults in case no info found
    spawnStatus = spawnStatusOptions.unspawned;
    life = 0;
    rift = 0;

    if (rawPointInfo.point) {
      const { point } = rawPointInfo;
      const {
        'probable-dominion': dominion,
        npoint
      } = point;
      layer = layerOptions[dominion];
      spawnedCount = point['spa-count'];
      sponsorChain = point['sponsor-chain'].reverse();

      if (npoint) {
        life = npoint.net.keys.life;
        rift = npoint.net.rift;
        if (life > 0) {
          keysSet = true;
        }
        pointInfo.proxies = npoint.own;  
        if (pointInfo.proxies.owner.address === '0x86cd9cd0992f04231751e3761de45cecea5d1801') {
          spawnStatus = spawnStatusOptions.locked; 
        } else if (keysSet) {
          spawnStatus = spawnStatusOptions.spawned;
          spawnedUnlocked = true;
        } else {
          spawnStatus = spawnStatusOptions.spawnedNoKeys;
          spawnedUnlocked = true;
        }
      }
    }
  }
  return {
    ...pointInfo,
    layer,
    spawnStatus,
    spawnedUnlocked,
    keysSet,
    life,
    rift,
    spawnedCount,
    sponsorChain,
  };
}
