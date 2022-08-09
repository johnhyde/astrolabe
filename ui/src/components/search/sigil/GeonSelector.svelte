<script lang="ts">
  import Symbol from './Symbol.svelte';

  import type { PartType, SymbolQuery } from 'types/sigil';
  import { GEONS } from 'types/sigil';

  export let symbolQuery: SymbolQuery;
  export let inputMode: PartType;

  let size = 48;

  function setGeon(geon) {
    symbolQuery.geon = geon;
    inputMode = undefined;
  }
</script>

<div on:click={() => inputMode = undefined}>
  done
</div>
<div on:click={() => setGeon(undefined)}>
  clear
</div>
{#each GEONS as geon}
  <div style:width="{size}px" on:click={() => setGeon(geon)}>
    <Symbol components={[geon]} {size} />
  </div>
{/each}

