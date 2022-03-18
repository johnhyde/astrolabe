<script lang="ts">
  import { Groups, Rolodex } from '@urbit/api';
  import store from '../stores/store';
  import ShipListing from './ShipListing.svelte';
  import SearchResultNavButtons from './SearchResultNavButtons.svelte';
  import ShipView from './ShipView.svelte';
  export let searchQuery : RegExp;
  export let patp : string;
  let contactsList = [];
  let selectedShipIndex: number;

  $: {
    if (!patp) {
      store.search(searchQuery)
    }
    // if (searchQuery) {
    //   store.search(searchQuery)
    // } else {
    //   store.reset();
    // }
  }
  $: {
    contactsList = Object.entries($store?.contacts).map(([patp, ship]) => {
      return {
        ...ship,
        patp,
      };
    });
    if (contactsList.length === 1) {
      selectedShipIndex = 0;
    } else {
      selectedShipIndex = null;
    }
  }
  $: selectedShip = contactsList[selectedShipIndex]

  function updateIndex(e) {
    selectedShipIndex = e.detail.index;
  }
</script>

<!-- should actually switch on whether field is empty -->
<!-- searchQuery is undefined when query is invalid -->
<!-- {#if searchQuery === undefined}
  <p class="p-6 rounded-lg bg-white">
    Hello, ~{window.ship}, would you like to search?
  </p>
{/if} -->
{#if patp}
  <ShipView {patp} />
{:else if selectedShip}
  {#if contactsList.length > 1}
    <SearchResultNavButtons
      index={selectedShipIndex}
      totalResults={contactsList.length}
      on:updateIndex={updateIndex}
      />
  {/if}
  <ShipView patp={selectedShip.patp} />
{:else}
  <div class="flex justify-center">
    <div class="max-w-md w-full rounded-lg bg-white">
      {#each contactsList as contact, i (contact.patp)}
        <ShipListing ship={contact} on:click={() => selectedShipIndex = i}/>
      {/each}
    </div>
  </div>
{/if}
