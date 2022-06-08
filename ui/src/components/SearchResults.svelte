<script lang="ts">
  import { Groups, Rolodex } from '@urbit/api';
  import { searchPoints } from '../lib/api';
  import store from '../stores/store';
  import ShipListing from './ShipListing.svelte';
  import SearchResultNavButtons from './SearchResultNavButtons.svelte';
  import ShipView from './ShipView.svelte';
  export let query: RegExp;
  export let search: string;
  // export let patp: string;
  let contactsList = [];
  let selectedShipIndex: number;

  $: searchedPointsP = searchPoints(search)
  // $: {
  //   // if (!patp) {
  //     store.search(query)
  //   // }
  //   // if (searchQuery) {
  //   //   store.search(searchQuery)
  //   // } else {
  //   //   store.reset();
  //   // }
  // }
  // $: {
  //   contactsList = Object.entries($store?.contacts).map(([patp, ship]) => {
  //     return {
  //       ...ship,
  //       patp,
  //     };
  //   });
  //   if (contactsList.length === 1) {
  //     selectedShipIndex = 0;
  //   } else {
  //     selectedShipIndex = null;
  //   }
  // }
  // $: selectedShip = contactsList[selectedShipIndex]

  // function updateIndex(e) {
  //   selectedShipIndex = e.detail.index;
  // }
</script>

<!-- should actually switch on whether field is empty -->
<!-- searchQuery is undefined when query is invalid -->
<!-- {#if searchQuery === undefined}
  <p class="p-6 rounded-lg bg-white">
    Hello, ~{window.ship}, would you like to search?
  </p>
{/if} -->
<!-- {#if patp}
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
{:else} -->
{query}
{search}
{#await searchedPointsP}
Loading...
{:then { points }}
  <div class="max-w-md w-full rounded-lg bg-white">
    <!-- {#each contactsList as contact, i (contact.patp)}
      <ShipListing ship={contact} on:click={() => selectedShipIndex = i}/>
    {/each} -->
    {#each points as patp, i (patp)}
      <ShipListing ship={{ patp }} linkToShip />
    {/each}
  </div>
{:catch}
  <div class="max-w-md w-full rounded-lg bg-white">
    Search Too Broad
  </div>
{/await}
<!-- {/if} -->
