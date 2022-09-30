<script lang="ts">
  
  import type { Patp, Rolodex } from '@urbit/api';
  import { searchPoints } from 'lib/api';
  import type { SigilQuery } from 'lib/sigil';
  import { searchedContacts } from 'stores/searchStores';
  import ShipListings from '@/ShipListings.svelte';
  import SearchSettings from './SearchSettings.svelte';
  import SearchResultsNavButtons from './SearchResultsNavButtons.svelte';

  export let regexQuery: RegExp;
  export let sigilQuery: SigilQuery;
  export let patpSearch: string;
  export let searchMode: ('patp' | 'sigil') = 'patp';

  let combinedSearchResults = [];
  let searchedPointsP: Promise<any>;
  let searchedPoints: Patp[] = [];
  let selectedShipIndex: number;
  let page: number = 0;
  let pageSize: number = 50;
  let totalPages, firstItemOnPage;
  type status = ('init' | 'prog' | 'done' | 'fail');
  let searchStatus: status = 'init';
  let notification: string = null;

  let timer;
  $: {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (searchMode == 'patp') {
        searchedContacts.searchPatp(regexQuery);
      } else if (searchMode == 'sigil') {
        searchedContacts.searchSigil(sigilQuery.querySyls);
      }
    }, 1000);
  }

  function doSearch() {
    const searchSnap = search;
    searchStatus = 'prog';
    console.log(`starting search for "${searchSnap}"`);
    searchedPointsP = searchPoints(searchSnap, searchMode);
    searchedPointsP.then((points) => {
      if (search === searchSnap) {
        searchedPoints = points;
        searchStatus = 'done';
        console.log(`done searching for "${searchSnap}"`);
      } else {
        console.log(`throwing out results for outdated search "${searchSnap}" (currently on ${search})`);
      }
    }).catch((err) => {
      if (search === searchSnap) {
        searchedPoints = [];
        searchStatus = 'fail';
      }
    });
  }
  $: search = (searchMode === 'sigil') ? sigilQuery.string : patpSearch;
  $: [search], doSearch();

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
  $: {
    totalPages = Math.ceil(combinedSearchResults.length / pageSize);
    firstItemOnPage = page * pageSize;
    if (combinedSearchResults.length > 0) {
      if (firstItemOnPage >= combinedSearchResults.length) {
        page = totalPages - 1;
      } else if (firstItemOnPage < 0) {
        page = 0;
      }
    }
  }
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
    {#if pageResults.length >= 5}
      <SearchResultsNavButtons {page} {pageSize} {totalPages}
      on:updatePage={({ detail }) => page = detail.page}
      >
      <p class="px-4 py-8 text-center">
        Showing {itemRangeText} of {combinedSearchResults.length} results
      </p>
    </SearchResultsNavButtons>
    {/if}
  </div>
{/if}
