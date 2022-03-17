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
      svgString = sigil({
        patp: patp,
        renderer: stringRenderer,
        size,
        colors: ['black', 'white'],
      });
    } else if (shipClass === 'moon') {
      imgSrc = moonPng;
    } else {
      imgSrc = cometSvg;
    }
  }
</script>

<span style="height: {size}px; width: {size}px;" >
  {#if displaySigil}
    {@html svgString}
  {:else}
    <img src={imgSrc} alt={shipClass} style="height: {size}px; width: {size}px;" />
  {/if}
</span>
