<script lang="ts">
  import SymbolInputModeSelector from './SymbolInputModeSelector.svelte';
  import SymbolInputNavButtons from './SymbolInputNavButtons.svelte';
  import SymbolInput from './SymbolInput.svelte';
  import ClanSelect from './ClanSelect.svelte';
  import ToggleButton from '@/buttons/ToggleButton.svelte';

  import type { SigilQuery } from 'lib/sigil';
  import { searchSettings } from 'stores/searchStores';
  import { toggleStoreKey } from 'lib/utils';

  export let sigilQuery: SigilQuery;
  let focusedSymbolIndex: number = undefined;
  let inputComponents: string[] = [];

  $: gridClasses = (sigilQuery.clan === 'galaxy' ? 'max-w-[10rem] grid items-center' : 'max-w-[18rem] grid grid-cols-2 items-center');

  function unfocusSymbol() {
    focusedSymbolIndex = undefined;
  }
  $: focusedSymbol = sigilQuery.activeSymbols[focusedSymbolIndex];
  $: {
    const numActiveSymbols = sigilQuery.activeSymbols.length;
    if (focusedSymbolIndex >= numActiveSymbols) {
      focusedSymbolIndex = numActiveSymbols - 1;
    }
  }
  
  function toggleAllowFictional() {
    toggleStoreKey(searchSettings, 'allowFictionalSigils');
  }

  function clear() {
    sigilQuery = sigilQuery.clearSymbols();
  }

  $: {
    sigilQuery.allowFictional = $searchSettings.allowFictionalSigils;
  }
</script>

<div>
  <ClanSelect bind:clan={sigilQuery.clan} />
  <div class="flex flex-col xs:flex-row">
    <div class="grow-[2] w-full xs:m-0 xs:max-w-[18rem]" on:click={unfocusSymbol}>
      <div class="min-h-[14rem] mx-auto p-4 {gridClasses} xs:rounded-bl-2xl">
        {#each sigilQuery.activeSymbols as symbol, index}
          <SymbolInput
            bind:symbolQuery={symbol}
            {focusedSymbolIndex}
            {index}
            clan={sigilQuery.clan}
            {inputComponents}
            on:click={() => focusedSymbolIndex = index}
          />
        {/each}
      </div>
    </div>
    <div class="px-4 py-2 border-t grow rounded-b-2xl xs:border-l xs:border-t-0 xs:rounded-bl-none">
      {#if focusedSymbol}
        <SymbolInputModeSelector
          bind:symbolQuery={focusedSymbol}
          bind:inputComponents
          unfocusSymbol={unfocusSymbol}
        />
        {:else}
        <SymbolInputNavButtons onClear={sigilQuery.isNotEmpty ? clear : null} />
        <p class="mt-2">
          Allow impossible Sigils:
          <ToggleButton on:click={toggleAllowFictional} on={$searchSettings.allowFictionalSigils} />
        </p>
      {/if}
    </div>
  </div>
  <!-- {#each sigilQuery.activeSymbols as symbol}
    {@const plausibleSyllables = symbol.plausibleSyllables}
    {@const plausibleParts = symbol.plausibleParts}
    <p>
      {#if plausibleSyllables.length < 20 && plausibleSyllables.length > 0}
        {plausibleSyllables.join(', ')}:
        {#if plausibleParts.length < 20 && plausibleParts.length > 0}
          {plausibleParts.join(', ')}
        {:else}
          {plausibleParts.length}
        {/if}
      {:else}
        {plausibleSyllables.length}
      {/if}
    </p>
  {/each} -->
  <!-- {sigilQuery.string} -->
</div>
