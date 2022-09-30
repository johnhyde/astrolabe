<script lang="ts">
  import SymbolInputNavButtons from './SymbolInputNavButtons.svelte';

  import GeonSelector from './GeonSelector.svelte';
  import SymbolInputModeSelectorButton from './SymbolInputModeSelectorButton.svelte';

  import { searchSettings } from 'stores/searchStores';
  import type { PartType, ModeDef, ModeDefs } from 'types/sigil';
  import type { SymbolQuery } from 'lib/sigil';
  import { MODE_DEFS } from 'types/sigil';
  import { filterPartsByGeon, getDeepParts } from 'lib/sigil';

  export let symbolQuery: SymbolQuery = null;
  export let inputComponents: string[] = [];
  export let unfocusSymbol: Function = () => {};

  let modes: string[] = [];
  let modeDef: ModeDef = undefined;
  let subModeDefs: ModeDefs = MODE_DEFS;

  function showGeonSelector() {
    if (!symbolQuery.components.length && modes.length == 0) {
      modes = ['geon'];
    }
  }

  $: symbolQuery.components, showGeonSelector();

  function pushMode(mode: string) {
    if (modeDef?.modes) {
      modes = [...modes, mode];
    } else {
      modes = [...modes.slice(0, -1), mode];
    }
  }

  function popMode() {
    if (modes.length) {
      if (modeDef?.modes) {
        modes = modes.slice(0, -1);
      } else {
        modes = modes.slice(0, -2);
      }
    } else {
      unfocusSymbol();
    }
  }

  $: {
    modeDef = undefined;
    subModeDefs = MODE_DEFS;
    for (let mode of modes) {
      if (modeDef && modeDef.modes) {
        subModeDefs = modeDef.modes;
      }
      if (subModeDefs[mode]) {
        modeDef = subModeDefs[mode];
      } else {
        console.error(`Unknown mode: ${mode} of ${modes} in defs:`, subModeDefs);
      }
    }

    if (modeDef && modeDef.modes) {
      subModeDefs = modeDef.modes;
    }

    if (modeDef?.parts?.length && !modeDef.modes) {
      inputComponents = modeDef.parts;
      if (!$searchSettings.allowFictionalSigils) {
        inputComponents = symbolQuery.filterPlausibleParts(inputComponents);
      }
    } else {
      inputComponents = [];
    }
  }

  $: plausibleModes = Object.entries(subModeDefs).map(([modeName, def]) => {
    const deepParts = getDeepParts(def);
    const plausible = $searchSettings.allowFictionalSigils || symbolQuery.arePartsPlausible(deepParts);
    if (!plausible && modeName !== 'geon') return null;
    const parts = filterPartsByGeon(def.displayParts || def.parts, symbolQuery.geon);
    return { parts, modeName };
  }).filter(mode => mode !== null);

  $: {
    const currentMode = modes.slice(-1)[0];
    if (currentMode != 'geon') {
      if (plausibleModes.length === 0) {
        popMode();
      } else if (plausibleModes.length >= 1) {
        const leafMode = modeDef && !(modeDef.modes);
        const plausibleModeNames = plausibleModes.map(({ modeName }) => modeName);
        if ((modes.length == 1 && modeDef.modes) || (leafMode && !plausibleModeNames.includes(currentMode))) {
          pushMode(plausibleModes[0].modeName);
        }
      }
    }
  }

  function clear() {
    if (modes.length) {
      symbolQuery = symbolQuery.clearPartType(modes[0] as PartType);
    } else {
      symbolQuery = symbolQuery.clear();
    }
  }
</script>

<style lang="scss">
  .grid-cols-custom {
    grid-template-columns: repeat(auto-fill, 48px);
  }
</style>

<div class="mx-auto flex justify-center xs:items-center xs:flex-col">
  <SymbolInputNavButtons onDone={popMode} onClear={clear} />
  <div class="max-w-[15rem] h-full grid grid-cols-custom gap-1 justify-center xs:max-w-[8rem]">
    {#if modes[0] === 'geon'}
      <GeonSelector bind:symbolQuery {popMode} />
    {:else}
      {#each plausibleModes as { modeName, parts }}
        <SymbolInputModeSelectorButton components={parts} focused={modes.slice(-1)[0] === modeName}
          on:click={() => pushMode(modeName)}
        />
      {/each}
    {/if}
  </div>
</div>

