<script lang="ts">
  import { push, replace, location, querystring } from 'svelte-spa-router'
  import pageName from 'stores/pageName';
  import { SearchAnalysis } from 'lib/id';
  import { SigilQuery } from 'lib/sigil';
  import { buildQuerystring } from 'lib/utils';
  import { linkToShip, linkToChart, linkToSearch } from 'lib/link';
  import SearchBar from "@/search/SearchBar.svelte";
  import SearchResults from "@/search/SearchResults.svelte";
  import ShipView from '@/ship_view/ShipView.svelte';
  import StarChart from '@/StarChart.svelte';
  import ValidationProblems from '@/ValidationProblems.svelte';
  import HomeScreenTiles from '@/HomeScreenTiles.svelte';
  export let params: any = {};
  let analysis: SearchAnalysis = new SearchAnalysis();
  let sigilQuery: SigilQuery = new SigilQuery('planet');
  let navigating = false;

  let searchParams = new URLSearchParams($querystring);
  function getUrlSearchMode(searchParams) {
    return (searchParams.get('mode') == 'sigil') ? 'sigil' : 'patp';
  }
  let searchMode: ('patp' | 'sigil') = getUrlSearchMode(searchParams);
  let search: string = searchParams.get('search') || params.arg || '';
  let patp: string = undefined;
  let urlSearch = search;
  let urlSearchMode = searchMode;
  let urlChangedSinceShipQuery = false;
  $: {
    const searchParams = new URLSearchParams($querystring);
    const potentialUrlSearch = searchParams.get('search') || params.arg || '';
    if (($location + $querystring).includes(potentialUrlSearch)) {
      urlSearch = potentialUrlSearch;
      urlSearchMode = getUrlSearchMode(searchParams);
      urlChangedSinceShipQuery = true;
      navigating = false;
    }
  }
  $: {
    urlChangedSinceShipQuery = (search || true) && searchMode && false;
  }
  function nav(path, addToHistory = false) {
    (addToHistory ? push : replace)(path);
  }
  function navHome(addToHistory = false) {
    params.mode = null;
    params.arg = null;
    if (searchMode == 'patp') {
      nav('/', addToHistory);
    } else {
      nav('/' + buildQuerystring({ mode: searchMode }), addToHistory);
    }
  }
  function navToShipView(addToHistory = false) {
    params.mode = 'ship';
    params.arg = patp;
    if (patp === search) {
      nav(linkToShip(patp), addToHistory);
    } else {
      nav(linkToShip(patp, { search, mode: searchMode }), addToHistory);
    }
  }
  function navToSearch(addToHistory = false) {
    if (!search) {
      navHome(addToHistory);
    } else {
      params.mode = 'search';
      params.arg = search;
      nav(linkToSearch(search, { mode: searchMode }), addToHistory);
    }
  }
  function navToChart(addToHistory = true) {
    params.mode = 'chart';
    params.arg = search;
    nav(linkToChart(search), addToHistory);
  }

  function navToMode(mode, addToHistory = false) {
    switch (mode) {
      case 'ship':
        navToShipView(addToHistory);
        break;
      case 'search':
        navToSearch(addToHistory);
        break;
      default:
        navHome(addToHistory);
    }
  }
  function autoNav() {
    if ((search !== urlSearch || searchMode !== urlSearchMode)) {
      if (urlChangedSinceShipQuery) {
        search = urlSearch;
        searchMode = urlSearchMode;
      } else {
        navigating = true;
        if (params.mode === 'chart') {
          navToChart(analysis.patpIsValid);
        } else {
          if (patp) {
            navToShipView(true);
          } else {
            const fromShipMode = params.mode === 'ship';
            navToSearch(fromShipMode);
          }
        }
      }
    }
  }
  $: urlSearch, urlSearchMode, search, searchMode, autoNav();
  $: {
    let properMode = params.mode;
    if (properMode === 'chart') {
      // nice
    } else if (analysis.search === search) {
      if (analysis.patpIsValid) {
        properMode = 'ship';
      } else if (analysis.search.length > 0) {
        properMode = 'search';
      }
    }
    if (params.mode !== properMode) {
      navToMode(properMode, false);
    }
  }

  let placeholderText;
  $: {
    if (analysis.search === urlSearch) {
      placeholderText = undefined;
      switch (params.mode) {
        case 'ship':
          $pageName = params.arg;
          break;
        case 'search':
          $pageName = 'Search';
          break;
        case 'chart':
          $pageName = 'Star Chart';
          placeholderText = 'Search by @p or #.';
          break;
        default:
          $pageName = null;
      }
    }
  }


</script>

<div class="p-4 space-y-4 min-h-full flex flex-col items-center 2xs:p-8 2xs:space-y-8">
  <SearchBar bind:analysis bind:sigilQuery bind:search bind:searchMode bind:patp {placeholderText} />
  <!-- <div class="bg-white">
    <p>
      Search: {search}
    </p>
    <p>
      URL Search: {urlSearch}
    </p>
    <p>
      Search mode: {searchMode}
    </p>
    <p>
      Patp: {patp}
    </p>
  </div> -->
  {#if params.mode == "chart"}
    <StarChart patp={patp || null} />
  {:else if patp}
    <ShipView {patp} />
  {:else if (searchMode === 'patp' && analysis.queryIsValid) || (searchMode === 'sigil' && sigilQuery.isWorthSearching)}
    <SearchResults regexQuery={analysis.query} sigilQuery={sigilQuery}
      patpSearch={analysis.search} {searchMode} />
  {:else if (analysis.search.length > 0 && analysis.queryProblems.length > 0)}
    <ValidationProblems problems={analysis.queryProblems} />
  {:else}
    <HomeScreenTiles />
  {/if}
</div>
