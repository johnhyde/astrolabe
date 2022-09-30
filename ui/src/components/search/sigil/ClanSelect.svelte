<script lang="ts">
  import ClanSelectOption from './ClanSelectOption.svelte';

  import { capitalize } from 'lib/utils';
  import { CLANS, Clan } from 'types/sigil';

  export let clan: Clan = 'planet';

  let dropdownOpen = false;

  function selectClan(itemClan: typeof clan) {
    clan = itemClan;
    dropdownOpen = false;
  }
</script>

<div class="text-xl text-center bg-white">
  <p
    on:click={() => dropdownOpen = true}
    class=" py-2"
  >
    {capitalize(clan)}
    <span class="font-mono">▼</span>
  </p>
  {#if dropdownOpen}
    <div class="absolute z-20 top-1 w-full flex flex-col mx-auto divide-y bg-white rounded-2xl border-b">
      <h3 class="py-2" on:click={() => dropdownOpen = false}>
        Select Sigil Type
      </h3>
      {#each CLANS as itemClan}
        <ClanSelectOption clan={itemClan} on:click={() => selectClan(itemClan)} />
      {/each}
    </div>
  {/if}
</div>

