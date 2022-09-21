<script lang="ts">
  import Symbol from './Symbol.svelte';
  import without from 'lodash/without';

  import { searchSettings } from 'stores/searchStores';
  import type { PartType } from 'types/sigil';
  import type { SymbolQuery } from 'lib/sigil';
  import { filterPartsByGeon } from 'lib/sigil';
  import * as colors from 'lib/colors';

  export let symbolQuery: SymbolQuery;
  // export let inputMode: PartType;
  export let focusedSymbolIndex: number;
  export let index: number = 0;
  export let clan: string = 'galaxy';
  export let inputComponents: string[] = [];
  export let fgColor = 'black';
  export let bgColor = 'white';
  let size = 128;

  let translateClass;
  $: {
    if (focusedSymbolIndex === undefined) {
      translateClass = 'translate-x-0 translate-y-0';
    } else if (clan === 'star') {
      translateClass = index ? 'origin-right' : 'origin-left';
    } else if (clan === 'planet') {
      let cornerIndex = index;
      if (!focused) cornerIndex = focusedSymbolIndex;
      switch (cornerIndex) {
        case 0: translateClass = 'translate-x-1/4 translate-y-1/4'; break;
        case 1: translateClass = '-translate-x-1/4 translate-y-1/4'; break;
        case 2: translateClass = 'translate-x-1/4 -translate-y-1/4'; break;
        case 3:
        default: translateClass = '-translate-x-1/4 -translate-y-1/4';
      }
    }
  }
  $: scaleClass = 'scale-150 ';

  $: focused = index === focusedSymbolIndex;
  $: focusedClasses = (
    focused ? `${scaleClass} z-10`  
    : (focusedSymbolIndex !== undefined ? 'scale-50' : '' )
  );
  // $: focusedClasses = focused ? `border border-gold-s1 border-2` : '';

  function onPartDelete({ detail: partId }) {
    symbolQuery = symbolQuery.removePart(partId);
  }

  function onPartClick({ detail: partId }) {
    symbolQuery = symbolQuery.addPart(partId);
  }

  let filteredInputComponents = [];
  let inputContainsStrokes;
  $: {
    if (inputComponents) {
      filteredInputComponents = without(inputComponents, ...symbolQuery.components);
    } else {
      filteredInputComponents = [];
    }
    filteredInputComponents = filterPartsByGeon(filteredInputComponents, symbolQuery.geon);
  }
  $: {
    inputContainsStrokes = undefined !== filteredInputComponents.find((c) => {
      return c[0] === 'l' || c[0] === 'a' || c[0] === 'b';
    });
  }
  $: plausible = $searchSettings.allowFictionalSigils || symbolQuery.isPlausible;
</script>

<div class="aspect-square relative flex transition {translateClass} {focusedClasses}"
  style:max-width="{size}px"
  on:click|stopPropagation
>
<!-- fgColor={!plausible ? 'red' : (symbolQuery.isPerfectMatch ? colors.GOLDS1 : 'black')} -->
  {#if symbolQuery.components.length > 0}
    <Symbol components={symbolQuery.components} {size}
      inverted={!symbolQuery.geon}
      interactive={focused}
      fgColor={!plausible ? 'red' : (symbolQuery.isPerfectMatch ? 'black' : '#333')}
      bgColor="white"
      altBgColor="transparent"
      hoverColor="red"
      on:partClick={onPartDelete}
    />
  {:else}
  <div class="border-[1.5px] border-white grow bg-white">
  <div class="rounded-md border-4 border-gray-500 h-full"></div>
    </div>
  {/if}
  {#if focused && filteredInputComponents.length}
    <div class="absolute inset-0 pointer-events-none">
      <Symbol components={filteredInputComponents} {size}
        strokeWidthFactor={inputContainsStrokes ? 2.5 : 1}
        fgColor={symbolQuery.geon ? bgColor : fgColor}
        bgColor={!symbolQuery.geon ? bgColor : fgColor}
        altBgColor="transparent"
        opacity={0.5}
        inverted
        interactive
        on:partClick={onPartClick}
        />
    </div>
  {/if}
</div>
