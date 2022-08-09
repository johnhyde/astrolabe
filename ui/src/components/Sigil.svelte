<script lang="ts">
  import { clan } from 'urbit-ob';
  import { sigil as sigil1, stringRenderer as sr1 } from '@tlon/sigil-js';
  import { sigil as sigil2, stringRenderer as sr2 } from '@johnhyde/sigil-js';
  import { sigilScalingFunction } from 'lib/sigil';
  import moonPng from '../assets/moon.png';
  import cometSvg from '../assets/comet.svg';

  export let patp: string;
  export let size: number;
  export let useNew: boolean = false;
  export let fgColor: string = 'white';
  export let bgColor: string = 'black';
  export let altBgColor: string = undefined;
  let svgString: any;
  let imgSrc: any;

  $: shipClass = clan(patp);
  $: displaySigil = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: {
    if (displaySigil) {
      let sigil = sigil1;
      let sr = sr1;
      let svgAST;
      if (useNew) {
        sigil = sigil2;
        sr = sr2;
        svgAST = sigil({
          patp: patp,
          size,
          colors: [bgColor, fgColor],
          autoScaleStrokes: true,
          strokeScalingFunctionV2: sigilScalingFunction,
        });
      } else {
        svgAST = sigil({
          patp: patp,
          size,
          colors: [bgColor, fgColor],
        });
      }
      svgAST.attributes.preserveAspectRatio = 'xMidYMin slice';
      svgString = sr(svgAST);
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
