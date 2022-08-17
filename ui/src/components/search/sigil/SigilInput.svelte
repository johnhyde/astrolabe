<script lang="ts">
  import SymbolInputModeSelector from './SymbolInputModeSelector.svelte';
  import SymbolInput from './SymbolInput.svelte';
  import ClanSelect from './ClanSelect.svelte';

  import type { PartType } from 'types/sigil';
  import type { SigilQuery } from 'lib/sigil';

  export let sigilQuery: SigilQuery;
  // export let clan: ('galaxy' | 'star' | 'planet') = 'planet';
  let focusedSymbolIndex: number = 0;
  let inputComponents: string[] = [];

  // let symbols: SymbolQuery = [];

  $: gridClasses = (sigilQuery.clan === 'galaxy' ? 'w-[50%]' : 'grid grid-cols-2 items-center');

  $: focusedSymbol = sigilQuery.activeSymbols[focusedSymbolIndex];
  $: {
    const numActiveSymbols = sigilQuery.activeSymbols.length;
    if (focusedSymbolIndex >= numActiveSymbols) {
      focusedSymbolIndex = numActiveSymbols - 1;
    }
  }
  // function updateSigilQuery() {
  //   sigilQuery.setSymbol(focusedSymbol, focusedSymbolIndex);
  // }
  // $: focusedSymbol, updateSigilQuery();
</script>

<div class="">
  <ClanSelect bind:clan={sigilQuery.clan} />
  <div class="flex flex-col xs:flex-row">
    <div class="grow-[2] mx-auto w-full xs:m-0 xs:max-w-[18rem]">
      <div class={`max-w-[18rem] mx-auto p-4 ${gridClasses} xs:rounded-bl-2xl`}>
        {#each sigilQuery.activeSymbols as symbol, index}
          <SymbolInput
            bind:symbolQuery={symbol}
            focused={index === focusedSymbolIndex}
            {inputComponents}
            on:click={() => focusedSymbolIndex = index}
          />
        {/each}
      </div>
    </div>
    {#if focusedSymbol}
      <div class="bg-green-100 grow rounded-b-2xl xs:rounded-bl-none">
        <SymbolInputModeSelector
          bind:symbolQuery={focusedSymbol}
          bind:inputComponents
          unfocusSymbol={() => focusedSymbolIndex = undefined}
        />
      </div>
    {/if}
  </div>
  <!-- {sigilQuery.string} -->
</div>
