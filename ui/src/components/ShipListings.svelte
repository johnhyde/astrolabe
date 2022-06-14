<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ShipListing from './ShipListing.svelte';
  const dispatch = createEventDispatcher();

  export let ships = [];
  export let linkToShips = false;
  export let differentiateContacts = false;

  function onClick(index) {
    dispatch('click', index);
  }
</script>

<div class="divide-y">
  {#each ships as ship, i (ship.patp)}
    <ShipListing {ship} on:click={() => onClick(i)} linkToShip={linkToShips} {differentiateContacts} />
  {/each}
</div>
