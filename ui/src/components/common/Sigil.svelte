<script lang="ts">
  import { clan } from 'urbit-ob';
  // import { sigil as sigil1, stringRenderer as sr1 } from '@tlon/sigil-js';
  import { sigil as sigil2, stringRenderer as sr2 } from '@johnhyde/sigil-js';
  import { sigilScalingFunction, crowdedSigilScalingFunction } from 'lib/sigil';
  import moonPng from 'assets/moon.png';
  import cometSvg from 'assets/comet.svg';

  export let patp: string;
  export let size: number;
  export let useNew: boolean = false;
  export let fgColor: string = 'white';
  export let bgColor: string = 'black';
  export let altBgColor: string = undefined;
  export let noShrink: boolean = false;
  let svgString: any;
  let imgSrc: any;

  $: noShrinkClasses = noShrink ? 'shrink-0' : '';
  $: noShrinkWidth = noShrink ? size+'px' : 'initial';

  $: shipClass = clan(patp);
  $: crowded = ['comet', 'moon'].includes(shipClass);
  $: {
    // if (displaySigil) {
      // let sigil = sigil1;
      // let sr = sr1;
      // let svgAST;
      // if (useNew) {
      let sigil = sigil2;
      let sr = sr2;
      let svgAST = sigil({
          patp: patp,
          size,
          colors: [bgColor, fgColor],
          autoScaleStrokes: true,
          strokeScalingFunctionV2: crowded ? crowdedSigilScalingFunction : sigilScalingFunction,
        });
      // } else {
      //   svgAST = sigil({
      //     patp: patp,
      //     size,
      //     colors: [bgColor, fgColor],
      //   });
      // }
      svgAST.attributes.preserveAspectRatio = 'xMidYMin slice';
      svgString = sr(svgAST);
      if (altBgColor) {
        svgString = svgString.replace(/rect fill="[^"]+"/, `rect fill="${altBgColor}"`);
      }
    // } else if (shipClass === 'moon') {
    //   imgSrc = moonPng;
    // } else {
    //   imgSrc = cometSvg;
    // }
  }
</script>

<div class="grow {noShrinkClasses}" style:max-width="{size}px" style:width={noShrinkWidth}>
  <!-- {#if displaySigil} -->
    {@html svgString}
  <!-- {:else}
    <img src={imgSrc} alt={shipClass} class="mx-auto" />
  {/if} -->
</div>
