<script lang="ts">
  import GeonSelector from './GeonSelector.svelte';
  import SymbolInputModeSelectorButton from './SymbolInputModeSelectorButton.svelte';

  import Symbol from './Symbol.svelte';

  import type { PartType, SymbolQuery } from 'types/sigil';

  export let symbolQuery: SymbolQuery;
  // export let inputMode: PartType;
  export let inputComponents: string[] = [];
  export let unfocusSymbol: Function;

  interface ModeDefs {
    [mode: string]: ModeDef
  }
  interface ModeDef {
    modes?: ModeDefs;
    displayParts?: string[];
    parts?: string[];
  }

  const modeDefs: ModeDefs = {
    geon: {
      modes: {},
      displayParts: ['ghb'],
    },
    line: {
      modes: {
        mainFulls: {
          parts: ['lvf', 'lhf', 'lff', 'lbf'],
        },
        halvesFulls: {
          parts: ['lvfl', 'lvfr', 'lhft', 'lhfb', 'lfht', 'lfhb', 'lbht', 'lbhb'],
        },
        forwards: {
          parts: ['lff', 'lfft', 'lffb'],
        },
        backwards: {
          parts: ['lbf', 'lbft'],
        },
        weirds: {
          parts: ['lbhtf', 'lbrf', 'lfhm'],
        }
      },
      parts: ['lvf', 'lvfl', 'lvfr', 'lhf', 'lhft', 'lhfb', 'lff', 'lbf'],
    },
    arcCorner: {
      modes: {
        trFulls: {
          parts: ['atrf8', 'atrf6', 'atrf4', 'atrf2'],
        },
        trHalves: {
          parts: [/*'atra8',*/ 'atra6', 'atra4', 'atra2', 'atrb8', 'atrb6', 'atrb4', 'atrb2'],
          displayParts: ['atrb8', 'atrb6', 'atrb4', 'atrb2'],
        },
        tlFulls: {
          parts: ['atlf8', 'atlf6', 'atlf4', 'atlf2'],
        },
        tlHalves: {
          parts: ['atla8', 'atla6', 'atla4', 'atla2', 'atlb8', 'atlb6', 'atlb4', 'atlb2'],
          displayParts: ['atlb8', 'atlb6', 'atlb4', 'atlb2'],
        },
        blFulls: {
          parts: ['ablf8', 'ablf6', 'ablf4', 'ablf2'],
        },
        blHalves: {
          parts: ['ablb8', 'ablb6', 'ablb4', 'ablb2'],
          displayParts: ['ablb8', 'ablb6', 'ablb4', 'ablb2'],
        },
        brFulls: {
          parts: ['abrf8', 'abrf6', 'abrf4', 'abrf2'],
        },
        brHalves: {
          parts: ['abrb8', 'abrb6', 'abrb4', 'abrb2'],
          displayParts: ['abrb8', 'abrb6', 'abrb4', 'abrb2'],
        },
      },
      parts: ['ablf8', 'ablf6', 'ablf4', 'ablf2'],
    },
    arc: {
      modes: {
        rings: {
          parts: ['am081', 'am082', 'am083', 'am08s'],
        },
        diagonals: {
          parts: ['am741', 'am742', 'am743', 'am422', 'am423'],
        },
        topsBottoms: {
          parts: ['ab2', 'ab3', 'ab4', 'at1', 'at3', 'at4'],
        },
        leftsRights: {
          parts: ['al2', 'al3', 'al4', 'ar1', 'ar2', 'ar4'/*, 'arb2'*/],
        },
        rights: {
          parts: ['am642', 'am643'],
        },
        middles: {
          parts: ['am222', 'am223', 'am622', 'am623'],
        },
        middless: {
          parts: ['am142', 'am443'],
        },
        topRights: {
          parts: ['am021', 'am022', 'am023', 'am242', 'arb2'],
        },
        // weirds: {
        //   parts: ['arb2'],
        // },
      },
      parts: ['am222', 'am223', 'ar4', 'ar2', 'ar1'],
    },
    circle: {
      parts: [
        'cbr3mb', 'ctl3mb',
        'cmmb',
        'ct2mb', 'cl2mb', 'cb2mb', 'cr2mb',
      ],
    },
    donut: {
      parts: ['dbl', /*'dl',*/ 'dm', 'dtl', 'dtr'],
    },
    bezier: {
      parts: ['b1l1', 'b1l2', 'b1l3'],
    },
  };
  let modes: string[] = [];
  let modeDef: ModeDef = undefined;
  let subModeDefs: ModeDefs = modeDefs;
  let size = 48;


  $: {
    if (!symbolQuery.geon) {
      modes = ['geon'];
    }
  }

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
    subModeDefs = modeDefs;
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
    } else {
      inputComponents = [];
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

<div class="grid grid-rows-2 grid-flow-col xs:grid-cols-2 xs:grid-flow-row place-content-center justify-center">
  <div
    class="aspect-square"
    on:click={popMode}
  >
    done
  </div>
  <div
    class="aspect-square"
    on:click={clear}
  >
    clear
  </div>
  {#if modes[0] === 'geon'}
    <GeonSelector bind:symbolQuery {popMode} />
  {:else}
    <!-- {#each PART_TYPES as partType}
      <SymbolInputModeSelectorButton {partType} focused={modes[0] === partType}
        on:click={() => pushMode(partType)}
      />
    {/each} -->
    {#each Object.entries(subModeDefs) as [modeName, def]}
      <SymbolInputModeSelectorButton components={def.displayParts || def.parts} focused={modes.slice(-1)[0] === modeName}
        on:click={() => pushMode(modeName)}
      />
    {/each}
  {/if}
</div>

