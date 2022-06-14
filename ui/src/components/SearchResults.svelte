<script lang="ts">
  
  import type { Patp, Rolodex } from '@urbit/api';
  import { searchPoints } from '../lib/api';
  import store from '../stores/store';
  import ShipListings from './ShipListings.svelte';

  export let query: RegExp;
  export let search: string;
  // export let patp: string;
  let combinedSearchResults = [];
  let searchedPoints: Patp[] = [];
  let selectedShipIndex: number;

  $: searchedPointsP = searchPoints(search)
  $: {
    searchedPointsP.then((points) => {
      searchedPoints = points;
    });
  }

  $: {
    // if (!patp) {
      store.search(query)
    // }
    // if (searchQuery) {
    //   store.search(searchQuery)
    // } else {
    //   store.reset();
    // }
  }
  $: {
    const contactSearchResults = JSON.parse(JSON.stringify($store.contactSearchResults));
    const contacts = [];
    const nonContacts = [];
    searchedPoints.forEach(patp => {
      const contact = contactSearchResults[patp];
      if (contact) {
        contacts.push({ ...contact, patp });
        delete contactSearchResults[patp];
      } else {
        nonContacts.push({ patp });
      }
    });
    const nonAzimuthContacts = Object.entries(contactSearchResults).map(([patp, ship]) => {
      return {
        ...ship,
        patp,
      };
    });
    combinedSearchResults = [...contacts, ...nonAzimuthContacts, ...nonContacts];
    if (combinedSearchResults.length === 1) {
      selectedShipIndex = 0;
    } else {
      selectedShipIndex = null;
    }
  }
  $: selectedShip = combinedSearchResults[selectedShipIndex]

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
<!-- {#if patp}
  <ShipView {patp} />
{:else if selectedShip}-->
  <!-- {#if contactsList.length > 1}
    <SearchResultNavButtons
      index={selectedShipIndex}
      totalResults={contactsList.length}
      on:updateIndex={updateIndex}
      />
  {/if} -->
<!--  <ShipView patp={selectedShip.patp} />
{:else} -->
<div class="max-w-md w-full rounded-lg bg-white overflow-hidden">
  {#await searchedPointsP}
    <p class="p-8 text-center">
      Searching all spawned points...
    </p>
  {:catch}
     <p class="p-8 text-center">
      Your search is too broad, please be more specific.
    </p>
  {/await}
  {#if combinedSearchResults.length === 0}
    <p class="p-8 text-center">
      No spawned ships match your search.
    </p>
  {:else}
    <ShipListings
      ships={combinedSearchResults}
      on:click={({ detail: i }) => selectedShipIndex = i}
      linkToShips differentiateContacts
    />
  {/if}
</div>
    <!-- {/if} -->
