<script lang="ts">
  import SymbolInputNavButtons from './SymbolInputNavButtons.svelte';

  import GeonSelector from './GeonSelector.svelte';
  import SymbolInputModeSelectorButton from './SymbolInputModeSelectorButton.svelte';

  import { searchSettings } from 'stores/searchStores';
  import keys from 'stores/keys';
  import type { PartType, ModeDef, ModeDefs } from 'types/sigil';
  import type { SymbolQuery } from 'lib/sigil';
  import { MODE_DEFS } from 'types/sigil';
  import { filterPartsByGeon, getDeepParts } from 'lib/sigil';

  export let symbolQuery: SymbolQuery = null;
  export let inputComponents: string[] = [];
  export let unfocusSymbol: Function = () => {};

  let mode: string = null;
  let subMode: string = null;
  let modeDef: ModeDef = undefined;
  let unselectedSubModesExist: boolean = false;
  let modeDefs: ModeDefs = MODE_DEFS;
  let plausibleModeDefs: { name: string,  def: ModeDef }[] = [];

  function showGeonSelector() {
    if (!symbolQuery.components.length && !mode) {
      mode = 'geon';
      subMode = null;
    }
  }

  $: symbolQuery.components, showGeonSelector();

  function pushMode(newMode: string) {
    const subModes = modeDef?.modes;
    if (subModes || subMode) {
      subMode = newMode;
    } else {
      mode = newMode;
      subMode = null;
    }
  }

  function popMode() {
    if (mode || subMode) {
      mode = null;
      subMode = null;
    } else {
      unfocusSymbol();
    }
  }

  $: {
    let modeResolved = false;
    let count = 0;
    while (!modeResolved && count < 5) {
      modeDef = undefined;
      modeDefs = MODE_DEFS;
      if (mode) {
        modeDef = MODE_DEFS[mode];
      }
      unselectedSubModesExist = !!modeDef?.modes;
      if (unselectedSubModesExist) {
        modeDefs = modeDef.modes;
        if (subMode) {
          if (modeDefs[subMode]) {
            modeDef = modeDefs[subMode];
          } else {
            console.error(`Unknown subMode: ${subMode} of ${mode} in defs:`, modeDefs);
            subMode = null;
          }
        }
      }
      unselectedSubModesExist = !!modeDef?.modes;
      if (!isDefPlausible(modeDef) && mode !== 'geon') {
        if (subMode) {
          subMode = null;
        } else {
          mode = null;
        }
      } else {
        plausibleModeDefs = getPlausibleModeDefs(modeDefs);
        if (unselectedSubModesExist) {
          subMode = plausibleModeDefs[0].name;
        } else {
          modeResolved = true;
        }
      }
      count++;
      if (count >= 5 && !modeResolved) {
        console.error("sigil input mode resulotion failed");
      }
    }
    inputComponents = [];
    if (modeDef?.parts?.length) {
      inputComponents = modeDef.parts;
      if (!$searchSettings.allowFictionalSigils) {
        inputComponents = symbolQuery.filterPlausibleParts(inputComponents);
      }
    }
  }

  function isDefPlausible(def: ModeDef): boolean {
    if (!def) return true;
    const deepParts = getDeepParts(def);
    return $searchSettings.allowFictionalSigils || symbolQuery.arePartsPlausible(deepParts);
  }

  function getPlausibleModeDefs(modeDefs: ModeDefs) {
    return Object.entries(modeDefs).map(([modeName, def]) => {
      const plausible = isDefPlausible(def);
      if (!plausible && modeName !== 'geon') return null;
      const parts = filterPartsByGeon(def.displayParts || def.parts, symbolQuery.geon);
      return {
        name: modeName,
        def: {
          ...def,
          parts,
        },
      };
    }).filter(mode => mode !== null);
  }

  function clear() {
    // If a geon is present it should be preserved, unless it's the only component
    // If there's only 1 component, it should be removed
    // Otherwise, at least one component might be a geon and should be preserved
    if (symbolQuery.components.length === 1) {
      symbolQuery = symbolQuery.clear();
    } else {
      symbolQuery = symbolQuery.clearExceptPartType('geon');
    }
  }

  $: {
    $keys.keyup.get('x').set('sigilMode', clear);
    $keys.keyup.get('backspace').set('sigilMode', clear);
    $keys.keyup.get('escape').set('sigilMode', popMode);
  }
</script>

<style lang="scss">
  .grid-cols-custom {
    grid-template-columns: repeat(auto-fill, 48px);
  }
</style>

<div class="mx-auto flex justify-center xs:items-center xs:flex-col">
  <SymbolInputNavButtons onDone={popMode} onClear={clear} hideClearButton={symbolQuery.components.length == 0} />
  <div class="max-w-[15rem] h-full grid grid-cols-custom gap-1 justify-center xs:max-w-[8rem]">
    {#if mode === 'geon'}
      <GeonSelector bind:symbolQuery {popMode} />
    {:else}
      {#each plausibleModeDefs as { name, def: { parts } }}
        <SymbolInputModeSelectorButton components={parts} focused={mode === name || subMode === name}
          on:click={() => pushMode(name)}
        />
      {/each}
    {/if}
  </div>
  <!-- <p class="break-all w-24">
    mode: {mode}
  </p>
  <p class="break-all w-24">
    sub: {subMode}
  </p> -->
</div>

