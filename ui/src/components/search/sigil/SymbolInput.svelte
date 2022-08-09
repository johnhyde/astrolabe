<script lang="ts">
  import Symbol from './Symbol.svelte';

  import type { SymbolQuery } from 'types/sigil';

  export let symbolQuery: SymbolQuery;
  export let focused: boolean = false;
  let size = 128;

  $: focusedClasses = focused ? 'border border-gold-s1 border-2' : '';
</script>

<div class="aspect-square flex {focusedClasses}" style:max-width="{size}px" on:click>
  {#if symbolQuery.components.length > 0}
    <Symbol components={symbolQuery.components} {size} inverted={!symbolQuery.geon} />
    {symbolQuery.geon}
  {:else}
    <div class="m-1 rounded-sm border-4 border-gray-500 grow"></div>
  {/if}
</div>
