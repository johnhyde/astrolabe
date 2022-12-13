<script lang="ts">
  import { clan } from 'urbit-ob';
  
  import { normalizeId, filterIdsForChildMoons } from 'lib/id';
  import { getSpawnedPoints, getUnlockedSpawnedPoints, getLockedSpawnedPoints } from 'lib/api';
  import store from 'stores/store';
  import ShipListings from '@/ShipListings.svelte';

  export let patp: string;
  export let spawnedCount: number = undefined;

  let rawSpawnedPointsPromise: any;
  let rawSpawnedPoints: any = null;
  let rawLockedPointsPromise: any;
  let rawLockedPoints: any = null;
  let spawnedPoints: string[] = [];
  let lockedPoints: string[] = [];

  $: shipClass = clan(patp);
  $: azPoint = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: canSpawnPoints = ['galaxy', 'star'].includes(shipClass);
  $: spawnableClassPlural = !canSpawnPoints ? '' : (shipClass === 'galaxy' ? 'Star' : 'Planet');
  $: {
    rawSpawnedPoints = null;
    rawLockedPoints = null;
    if (canSpawnPoints) {
      let galaxy = shipClass === 'galaxy';
      let getSpawnedPointsFunc = galaxy ? getUnlockedSpawnedPoints : getSpawnedPoints;
      if (galaxy) {
        rawLockedPointsPromise = getLockedSpawnedPoints(patp);
        rawLockedPointsPromise.then((info) => {
          rawLockedPoints = info;
        }).catch((error) => {
          rawLockedPoints = { error };
        });
      }
      rawSpawnedPointsPromise = getSpawnedPointsFunc(patp);
      rawSpawnedPointsPromise.then((info) => {
        rawSpawnedPoints = info;
      }).catch((error) => {
        rawSpawnedPoints = { error };
      });
    }
  }
  $: {
    spawnedPoints = [];
    if (rawSpawnedPoints?.points) {
      spawnedPoints = rawSpawnedPoints?.points.map(patpToShip);
    }
  }
  $: {
    lockedPoints = [];
    if (rawLockedPoints?.points) {
      lockedPoints = rawLockedPoints?.points.map(patpToShip);
    }
  }
  $: trueSpawnedCount = spawnedCount || spawnedPoints.length;
  $: spawnedTab = {
    name: 'Spawned',
    plural: 'Spawned ' + spawnableClassPlural + (trueSpawnedCount == 1 ? '' : 's'),
    promise: rawSpawnedPointsPromise,
    points: spawnedPoints,
    count: trueSpawnedCount,
  };
  $: lockedTab = {
    name: 'Locked',
    plural: 'Locked ' + spawnableClassPlural + (lockedPoints.length == 1 ? '' : 's'),
    promise: rawLockedPointsPromise,
    points: lockedPoints,
    count: lockedPoints.length,
  };
  $: moons = filterIdsForChildMoons($store.peers, patp).map(patpToShip);
  $: moonsTab = {
    name: 'Moons',
    plural: 'Known Moon' + (moons.length == 1 ? '' : 's'),
    promise: true,
    points: moons,
    count: moons.length,
  };
  let tabIndex = 0;
  let tabs = [];
  $: {
    tabs = [];
    if (spawnedCount !== undefined || spawnedPoints.length > 0) {
      tabs.push(spawnedTab);
    }
    if (lockedPoints.length > 0) {
      tabs.push(lockedTab);
    }
    if (azPoint) {
      tabs.push(moonsTab);
    }
  }
  $: tab = tabs[tabIndex];

  function patpToShip(id: string) {
    return { patp: normalizeId(id) };
  }
</script>

<div class="p-3">
  {#if tabs.length > 1}
    <div class="flex gap-x-1">
      {#each tabs as tab, i}
        <h3 on:click={() => tabIndex = i}
          class:bg-gray-200={tabIndex !== i}
          class="px-2 border border-gray-300 border-b-0 rounded-t-md cursor-pointer"
        >
          {tab.name}
        </h3>
      {/each}
    </div>
  {/if}
  {#if tab}
    <div>
      <h3 class="text-lg m-2">
        {#if tab.count}
        {tab.count} {tab.plural}:
        {:else}
        No {tab.plural}
        {/if}
      </h3>
      {#await tab.promise}
        Loading {tab.plural}...
      {:then}
      <!-- TODO: pagination -->
      <ShipListings
      ships={tab.points}
      linkToShips
      differentiateContacts
      />
      {/await}
    </div>
  {/if}
</div>

