<script lang="ts">
  import GeonSelector from './GeonSelector.svelte';
  import SymbolInputModeSelectorButton from './SymbolInputModeSelectorButton.svelte';

  import Symbol from './Symbol.svelte';

  import type { PartType, SymbolQuery } from 'types/sigil';
  import { PART_TYPES } from 'types/sigil';

  export let symbolQuery: SymbolQuery;
  export let inputMode: PartType;

  let size = 48;
</script>

<div class="grid grid-rows-2 grid-flow-col xs:grid-cols-2 xs:grid-flow-row place-content-center justify-center">
  {#if inputMode === 'geon'}
    <GeonSelector bind:symbolQuery bind:inputMode />
  {:else}
    {#each PART_TYPES as partType}
      <SymbolInputModeSelectorButton {partType} focused={inputMode === partType}
        on:click={() => inputMode = partType}
      />
    {/each}
  {/if}
</div>

