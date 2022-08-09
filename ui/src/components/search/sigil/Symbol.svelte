<script lang="ts">
  import { sigilFromSymbols, stringRenderer as sr, symbolFromDef } from '@johnhyde/sigil-js';
  import { sigilScalingFunction } from 'lib/sigil';

  export let components: string[];
  export let size: number;
  export let fgColor: string = 'black';
  export let bgColor: string = 'white';
  export let altBgColor: string = undefined;
  export let inverted: boolean = false;
  let svgString: any;

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
        strokeScalingFunctionV2: sigilScalingFunction,
      },
    );
    svgAST.attributes.preserveAspectRatio = 'xMidYMin slice';
    svgString = sr(svgAST);
    if (tempAltBgColor) {
      svgString = svgString.replace(/rect fill="[^"]+"/, `rect fill="${tempAltBgColor}"`);
    }
  }
</script>

<div class="aspect-square" style:max-width="{size}px" on:click>
  {@html svgString}
</div>
