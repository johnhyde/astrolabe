<script lang="ts">
  import SymbolInputModeSelectorButton from './SymbolInputModeSelectorButton.svelte';

  import { searchSettings } from 'stores/searchStores';
  import type { SymbolQuery } from 'lib/sigil';
  import { GEONS } from 'types/sigil';
  import { arePartsPlausible } from 'lib/sigil';

  export let symbolQuery: SymbolQuery;
  export let popMode: Function;

  function setGeon(geon) {
    symbolQuery.geon = geon;
    popMode();
  }

  $: componentsSansGeon = symbolQuery.components.filter(c => c[0] !== 'g');
</script>

{#each GEONS as geon}
  {@const plausible = $searchSettings.allowFictionalSigils ||
    arePartsPlausible(componentsSansGeon, symbolQuery.symbolType, [geon])
  }
  <SymbolInputModeSelectorButton components={[geon]}
    focused={geon === symbolQuery.geon}
    enabled={plausible}
    on:click={() => setGeon(geon)}
  />
{/each}

