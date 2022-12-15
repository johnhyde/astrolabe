<script lang="ts">
  
  import { sein } from 'urbit-ob';
  import uniq from 'lodash/uniq';
  import tooltip from 'actions/tooltip';
  import { normalizeId, filterIdsForChildMoons } from 'lib/id';
  import { filterObject } from 'lib/utils';
  import { addAllies } from 'lib/apps';
  import store from 'stores/store';
  import ExtensionWindow from '@/ExtensionWindow.svelte';
  import AppIcon from './AppIcon.svelte';

  export let patp: string;
  $: images = $store.gorae[patp] || [];
  $: itsUs = patp.substring(1) === window.ship;
</script>
{#if $store.palsInstalled}
  <ExtensionWindow name="Public Gorae" halfWidth>
    <svelte:fragment slot="top-bar">
      <div class="grow m-2 flex justify-end align-center">
          <button class="bg-gray-200 ml-3 px-2 rounded"
            on:click={() => store.getGorae(patp)}
          >
            Check for %gorae
          </button>
      </div>
    </svelte:fragment>
    {#each images as img}
      <img src={img} />
    {/each}
  </ExtensionWindow>
{/if}

