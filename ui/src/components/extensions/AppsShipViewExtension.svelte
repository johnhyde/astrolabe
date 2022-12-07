<script lang="ts">
  
  import { sein } from 'urbit-ob';
  import uniq from 'lodash/uniq';
  import tooltip from 'actions/tooltip';
  import { normalizeId, filterIdsForChildMoons } from 'lib/id';
  import { filterObject } from 'lib/utils';
  import { addAllies, delAllies } from 'lib/apps';
  import store from 'stores/store';
  import ExtensionWindow from '@/ExtensionWindow.svelte';
  import AppIcon from './AppIcon.svelte';

  export let patp: string;
  $: moons = filterIdsForChildMoons($store.peers, patp);
  $: possibleAllies = [patp, ...moons];
  $: knownApps = uniq(Object.values(filterObject($store.apps.allies, (ally) => {
    ally = normalizeId(ally);
    return patp === ally || sein(ally) === patp;
  })).flat());
  $: nonAllies = possibleAllies.filter((ally) => !$store.apps.allies[ally]);
  $: emptyAllies = possibleAllies.filter((ally) => {
    let apps = $store.apps.allies[ally];
    return apps && !apps.length;
  });
</script>
<ExtensionWindow name="Apps" halfWidth>
  <svelte:fragment slot="top-bar">
    <div class="grow m-2 flex justify-end align-center">
      {#if nonAllies.length > 0}
        <button class="bg-gray-200 ml-3 px-2 rounded"
          on:click={() => addAllies(nonAllies)}
        >
          Check for More
        </button>
        {/if}
        {#if emptyAllies.length > 0}
          <button class="bg-gray-200 ml-3 px-2 rounded"
          on:click={() => delAllies(emptyAllies)}
          >
          Stop Watching
          <span use:tooltip={emptyAllies.join(', ')}>
            {emptyAllies.length} Ship{emptyAllies.length > 1 ? 's': ''}
          </span>
        </button>
      {/if}
    </div>
  </svelte:fragment>
  {#if knownApps.length > 0}
    <div class="flex flex-wrap p-2 gap-2 justify-center">
      {#each knownApps as app}
        <AppIcon path={app} />
      {/each}
    </div>
  {/if}
</ExtensionWindow>

