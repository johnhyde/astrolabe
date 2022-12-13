<script lang="ts">

  import Sigil from "@/common/Sigil.svelte";
  import PalStatusIndicator from '@/pals/PalStatusIndicator.svelte';
  import { push } from 'svelte-spa-router'
  import { normalizeId } from 'lib/id';
  import { linkToShip as generateLinkToShip } from 'lib/link';
  import { getPalStatus } from 'lib/pals';
  import store from 'stores/store';
  export let ship: any;
  export let linkToShip: boolean = false;
  export let differentiateContacts = false;
  
  $: patp = normalizeId(ship.patp);
  $: contact = $store.contacts[ship.patp];
  $: borderClass = differentiateContacts ? (
    'border-l-8 ' + (contact ? 'border-gold' : 'border-gray-300')
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
  <div class="flex p-4 items-center gap-x-4">
    <Sigil {patp} size={48} useNew noShrink />
    <p class="break-words grow">
      <span class="align-middle mr-1">
        {patp}
      </span>
      <PalStatusIndicator status={getPalStatus($store.pals, patp)} class="inline" />
      <br/>
      {contact?.nickname ? `(${contact.nickname})` : ''}
    </p>
  </div>
</div>