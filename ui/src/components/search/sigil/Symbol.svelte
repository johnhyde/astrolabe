<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { sigilFromSymbols, stringRenderer as sr, symbolFromDef } from '@johnhyde/sigil-js';
  import { sigilScalingFunction } from 'lib/sigil';
  import symbolPartClick from 'actions/symbolPartClick';

  export let components: string[];
  export let size: number;
  export let fgColor: string = 'black';
  export let bgColor: string = 'white';
  export let altBgColor: string = undefined;
  export let hoverColor: string = '#8f8';
  export let opacity: number = 1;
  export let inverted: boolean = false;
  export let interactive: boolean = false;
  export let strokeWidthFactor: number = 1;
  let svgString: any;

  const dispatch = createEventDispatcher();

  $: {
    const symbol = symbolFromDef(components);
    let colors = [bgColor, fgColor];
    let tempAltBgColor = altBgColor;
    if (inverted) {
      colors = [fgColor, bgColor];
      if (!tempAltBgColor) tempAltBgColor = bgColor;
    }
    const svgAST = sigilFromSymbols(
      [symbol],
      {
        size,
        colors,
        margin: false,
        autoScaleStrokes: true,
        strokeScalingFunctionV2: (s) => {
          return strokeWidthFactor * sigilScalingFunction(s);
        },
      },
    );
    svgAST.attributes.preserveAspectRatio = 'xMidYMin slice';
    svgString = sr(svgAST);
    if (tempAltBgColor) {
      svgString = svgString.replace(/rect fill="[^"]+"/, `rect fill="${tempAltBgColor}"`);
    }
  }

  function onPartClick(partId: string) {
    dispatch('partClick', partId);
  }
</script>

<style lang="scss" global>
  .interactive {
    svg {
      pointer-events: none;
    }

    path, circle, line {
      pointer-events: auto;

      &:not([dataisgeon="true"]):hover {
        stroke: var(--hoverColor);
      }
    }

    circle:not([dataisgeon="true"]):not([fill="none"]):hover {
      fill: var(--hoverColor);
    }
  }
</style>

<div class="aspect-square" class:interactive style:max-width="{size}px"
  style="--hoverColor: {hoverColor}; opacity: {opacity};"
  on:click
  use:symbolPartClick={{ onPartClick, enabled: interactive, svgString }}
>
  {@html svgString}
</div>
