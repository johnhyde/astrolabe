<script lang="ts">
  import { clan, sein, patp2dec } from 'urbit-ob';
  import { link } from 'svelte-spa-router'
  import { linkToShip } from '../lib/link';
  import Sigil from "./Sigil.svelte";
  export let patp: string;
  let parentChain: any[];

  $: shipClass = clan(patp);
  $: azPoint = ['galaxy', 'star', 'planet'].includes(shipClass);
  $: {
    let parents = [patp];
    let galaxyFound = false;
    let count = 10;
    while (!galaxyFound && count > 0) {
      count--;
      if (count == 0) {
        throw new Error("You've got an infinite loop in building the parent chain");
      }
      let firstItem = parents[0];
      if (clan(firstItem) == 'galaxy') {
        galaxyFound = true;
      } else {
        parents.unshift(sein(firstItem))
      }
    }
    parents.pop();
    parentChain = parents.map(parent => {
      return { patp: parent, link: linkToShip(parent) };
    });
  }
</script>

<div class="flex justify-center">
  <div class="p-8 max-w-md w-full rounded-lg bg-white">
    <div class="mx-auto">
      <Sigil patp={patp} size={256} />
    </div>
    <h2 class="text-2xl text-center">{patp}</h2>
    <p>
      Ship Type: {shipClass}
    </p>
    {#if azPoint}
      <p class="break-all">
        Azimuth #: {patp2dec(patp)}
      </p>
    {/if}
    {#if parentChain.length > 0}
      <p>
        Parent:
        {#each parentChain as parent, index}
        {#if index > 0}{' > '} {/if}
          <a use:link={parent.link}>{parent.patp}</a>
        {/each}
      </p>
    {/if}
  </div>
</div>
