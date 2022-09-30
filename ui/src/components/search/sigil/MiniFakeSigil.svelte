<script lang="ts">
  import { sigilFromSymbols, stringRenderer as sr, symbolFromDef } from '@johnhyde/sigil-js';

  export let clan: ('galaxy' | 'star' | 'planet') = 'planet';

  let size = 32;
  let squareDef = ['gci'];
  let square = symbolFromDef(squareDef);
  let sigilProps = {
    size,
    renderer: sr,
    colors: ['white', 'black'],
    icon: true,
  }
  let sigils = {
    galaxy: sigilFromSymbols([square], sigilProps),
    star: sigilFromSymbols([square, square], sigilProps),
    planet: sigilFromSymbols([square, square, square, square], sigilProps),
  }
  $: sigilWidth = (clan === 'galaxy' ? size / 2 : size);
</script>

<div style:width="{sigilWidth}px">
  {@html sigils[clan]}
</div>
