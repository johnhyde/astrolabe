<script lang="ts">
  import ClanSelectOption from './ClanSelectOption.svelte';

  import { capitalize } from 'lib/utils';
  import { CLANS, Clan } from 'types/sigil';
  import keys from 'stores/keys';

  export let clan: Clan = 'planet';

  let dropdownOpen = false;

  function openDropdown() { dropdownOpen = true }
  function closeDropdown() { dropdownOpen = false }

  function selectClan(itemClan: typeof clan) {
    clan = itemClan;
    dropdownOpen = false;
  }

  $: {
    $keys.keyup.get('escape').set('clanSelect', closeDropdown);
  }
</script>

<div class="text-xl text-center bg-white">
  <p
    on:click={openDropdown}
    class=" py-2"
  >
    {capitalize(clan)}
    <span class="font-mono">▼</span>
  </p>
  {#if dropdownOpen}
    <div class="absolute z-20 top-1 w-full flex flex-col mx-auto divide-y bg-white rounded-2xl border-b">
      <h3 class="py-2" on:click={closeDropdown}>
        Select Sigil Type
      </h3>
      {#each CLANS as itemClan}
        <ClanSelectOption clan={itemClan} on:click={() => selectClan(itemClan)} />
      {/each}
    </div>
  {/if}
</div>

