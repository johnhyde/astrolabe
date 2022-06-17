<script lang="ts">
  
  import type { Patp, Rolodex } from '@urbit/api';
  import { searchPoints } from '../lib/api';
  import { searchedContacts } from '../stores/searchStores';
  import ShipListings from './ShipListings.svelte';
  import SearchSettings from './SearchSettings.svelte';
  import SearchResultsNavButtons from './SearchResultsNavButtons.svelte';

  export let query: RegExp;
  export let search: string;
  // export let patp: string;
  let combinedSearchResults = [];
  let searchedPoints: Patp[] = [];
  let selectedShipIndex: number;
  let page: number = 0;
  let pageSize: number = 50;
  let searchStatus: ('init' | 'prog' | 'done' | 'fail') = 'init';
  let notification: string = null;
  $: { searchedContacts.search(query) }
  $: searchedPointsP = searchPoints(search);
  $: {
    searchStatus = 'prog';
    searchedPointsP.then((points) => {
      searchedPoints = points;
      searchStatus = 'done';
    }).catch((err) => {
      searchedPoints = [];
      searchStatus = 'fail';
    });
  }

  $: {
    const contactSearchResults: Rolodex = JSON.parse(JSON.stringify($searchedContacts));
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
  $: totalPages = Math.ceil(combinedSearchResults.length / pageSize);
  $: firstItemOnPage = page * pageSize
  $: pageResults = combinedSearchResults.slice(firstItemOnPage, (page + 1) * pageSize);
  $: itemRangeText = pageResults.length == combinedSearchResults.length ? 'all' :
  `${firstItemOnPage + 1}-${firstItemOnPage + pageResults.length}`;

  $: {
    if (searchStatus == 'prog') {
      notification = 'Searching all spawned points...';
    } else if (searchStatus == 'fail') {
      notification = 'Your search is too broad, please be more specific.';
    } else if (searchStatus == 'done' && combinedSearchResults.length === 0) {
      notification = 'No spawned ships match your search.'
    } else {
      notification = null;
    }
  }
</script>

<SearchSettings/>
{#if notification}
<div class="rounded-lg bg-white overflow-hidden">
  <p class="py-4 px-6 text-center">
    {notification}
  </p>
</div>
{/if}
{#if combinedSearchResults.length > 0}
  <div class="max-w-md w-full rounded-lg bg-white overflow-hidden">
    <SearchResultsNavButtons {page} {pageSize} {totalPages}
      on:updatePage={({ detail }) => page = detail.page}
    >
      <p class="px-4 py-8 text-center">
        Showing {itemRangeText} of {combinedSearchResults.length} results
      </p>
    </SearchResultsNavButtons>
    <ShipListings
      ships={pageResults}
      linkToShips differentiateContacts
    />
  </div>
{/if}
