<script lang="ts">
  import Symbol from './Symbol.svelte';
  import without from 'lodash/without';

  import type { PartType, SymbolQuery } from 'types/sigil';

  export let symbolQuery: SymbolQuery;
  // export let inputMode: PartType;
  export let focused: boolean = false;
  export let inputComponents: string[] = [];
  let size = 128;

  $: focusedClasses = focused ? 'border border-gold-s1 border-2' : '';

  function onPartDelete({ detail: partId }) {
    symbolQuery = symbolQuery.removePart(partId);
  }

  function onPartClick({ detail: partId }) {
    symbolQuery = symbolQuery.addPart(partId);
  }

  let filteredInputComponents = [];
  $: {
    if (inputComponents) {
      filteredInputComponents = without(inputComponents, ...symbolQuery.components);
    } else {
      filteredInputComponents = [];
    }
  }
</script>

<div class="aspect-square relative flex {focusedClasses}" style:max-width="{size}px" on:click>
  {#if symbolQuery.components.length > 0}
    <Symbol components={symbolQuery.components} {size}
      inverted={!symbolQuery.geon}
      interactive={focused}
      hoverColor="red"
      on:partClick={onPartDelete}
    />
  {:else}
    <div class="m-1 rounded-sm border-4 border-gray-500 grow"></div>
  {/if}
  {#if focused && filteredInputComponents.length}
    <div class="absolute inset-0 pointer-events-none">
      <Symbol components={filteredInputComponents} {size}
        strokeWidthFactor={2.5}
        fgColor={symbolQuery.geon ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
        bgColor="transparent"
        inverted
        interactive
        on:partClick={onPartClick}
        />
    </div>
  {/if}
</div>
