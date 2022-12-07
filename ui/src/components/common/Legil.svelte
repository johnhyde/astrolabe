<script lang="ts">
  import { clan } from 'urbit-ob';
  import { legil, stringRenderer } from '@johnhyde/legil-js';
  import { sigilScalingFunction } from 'lib/sigil';
  import moonPng from 'assets/moon.png';
  import cometSvg from 'assets/comet.svg';

  export let patp: string;
  export let size: number;
  export let fgColor: string = 'white';
  export let bgColor: string = 'black';
  export let altBgColor: string = undefined;
  let svgString: any;
  let imgSrc: any;

  $: shipClass = clan(patp);
  $: displaySigil = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: {
    if (displaySigil) {
      let svgAST;
      svgAST = legil({
        patp: patp,
        size,
        colors: [bgColor, fgColor],
        autoScaleStrokes: true,
        strokeScalingFunctionV2: sigilScalingFunction,
      });
      svgAST.attributes.preserveAspectRatio = 'xMidYMin slice';
      svgString = stringRenderer(svgAST);
      if (altBgColor) {
        svgString = svgString.replace(/rect fill="[^"]+"/, `rect fill="${altBgColor}"`);
      }
    } else if (shipClass === 'moon') {
      imgSrc = moonPng;
    } else {
      imgSrc = cometSvg;
    }
  }
</script>

<div class="grow" style:max-width="{size}px">
  {#if displaySigil}
    {@html svgString}
  {:else}
    <img src={imgSrc} alt={shipClass} class="mx-auto" />
  {/if}
</div>
