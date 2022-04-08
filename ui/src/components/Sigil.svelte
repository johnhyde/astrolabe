<script lang="ts">
  import { clan } from 'urbit-ob';
  import { sigil, stringRenderer } from '@tlon/sigil-js';
  import moonPng from '../assets/moon.png';
  import cometSvg from '../assets/comet.svg';

  export let patp: string;
  export let size: number;
  let svgString: any;
  let imgSrc: any;

  $: shipClass = clan(patp);
  $: displaySigil = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: {
    if (displaySigil) {
      const svgAST = sigil({
        patp: patp,
        size,
        colors: ['black', 'white'],
      });
      svgAST.attributes.preserveAspectRatio = 'xMidYMin slice';
      svgString = stringRenderer(svgAST);
    } else if (shipClass === 'moon') {
      imgSrc = moonPng;
    } else {
      imgSrc = cometSvg;
    }
  }
</script>

<!-- <div style="height: {size}px; width: {size}px;" > -->
<div>
  {#if displaySigil}
    {@html svgString}
  {:else}
    <img src={imgSrc} alt={shipClass} class="mx-auto" />
  {/if}
</div>
