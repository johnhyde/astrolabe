<script lang="ts">

  import Sigil from "./Sigil.svelte";
  import { push } from 'svelte-spa-router'
  import { normalizeId } from '../lib/id';
  import { linkToShip as generateLinkToShip } from '../lib/link';
  export let ship: any;
  export let linkToShip: boolean = false;
  export let differentiateContacts = false;
  
  $: patp = normalizeId(ship.patp);
  $: borderClass = differentiateContacts ? (
    'border-l-8 ' + (Object.keys(ship).length > 1 ? 'border-gold' : 'border-gray-300')
  ) : '';

  function handleClick() {
    if (linkToShip) {
      push(generateLinkToShip(patp));
    }
  }
</script>

<div class="hover:bg-gray-200 {borderClass} cursor-pointer"
on:click={handleClick}
on:click
>
  <div class="flex flex-wrap p-4 items-center">
    <Sigil {patp} size={48} />
    {#if ship.avatar}
      <img src={ship.avatar} class="h-12 w-12 mr-4" />
    {/if}
    <p class="ml-4 break-words">
      {patp}<br/>{ship.nickname ? `(${ship.nickname})` : ''}
    </p>
  </div>
</div>