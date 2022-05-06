<script lang="ts">

  import Sigil from "./Sigil.svelte";
  import { push } from 'svelte-spa-router'
  import { normalizeId } from '../lib/id';
  import { linkToShip as generateLinkToShip } from '../lib/link';
  export let ship: any;
  export let linkToShip: boolean = false;
  
  $: patp = normalizeId(ship.patp);

  function handleClick() {
    if (linkToShip) {
      push(generateLinkToShip(patp));
    }
  }
</script>

<div class="flex flex-wrap p-4 border-b last:border-none items-center"
  on:click={handleClick}
  on:click
  >
  <Sigil {patp} size={48} />
  <!-- {#if ship.avatar}
    <img src={ship.avatar} class="h-12 w-12 mr-4" />
  {/if} -->
  <p class="ml-4 break-words" >
    {patp}<br/>{ship.nickname ? `(${ship.nickname})` : ''}
  </p>
</div>