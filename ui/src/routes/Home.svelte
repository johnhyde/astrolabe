<script lang="ts">
  import Router from 'svelte-spa-router';
  import { link, push, replace, location, querystring } from 'svelte-spa-router'
  import pageName from '../stores/pageName';
  import { SearchAnalysis } from '../lib/id';
  import { linkToShip } from '../lib/link';
  import SearchBar from "../components/SearchBar.svelte";
  import SearchResults from "../components/SearchResults.svelte";
  import ShipView from '../components/ShipView.svelte';
  import StarChart from '../components/StarChart.svelte';
  import ValidationProblems from '../components/ValidationProblems.svelte';
  import HomeScreenTiles from '../components/HomeScreenTiles.svelte';
  export let params: any = {};
  let analysis: SearchAnalysis = new SearchAnalysis();
  let navigating = false;
  
  let search: string = (new URLSearchParams($querystring)).get('search') || params.arg || '';
  let urlSearch = search;
  // let urlChanged;
  let urlChangedSinceAnalysisPatp = false;
  $: {
    const potentialUrlSearch = (new URLSearchParams($querystring)).get('search') || params.arg || '';
    if (($location + $querystring).includes(potentialUrlSearch)) {
      urlSearch = potentialUrlSearch;
      // urlChanged = Date.now();
      urlChangedSinceAnalysisPatp = true;
      navigating = false;
    }
  }
  $: {
    // analysisPatpChanged = (analysis.patp || true) && Date.now();
    urlChangedSinceAnalysisPatp = (analysis.patp || true) && false;
  }
  function nav(path, addToHistory = false) {
    (addToHistory ? push : replace)(path);
  }
  function navHome(addToHistory = false) {
    params.mode = null;
    params.arg = null;
    nav('/', addToHistory);
  }
  function navToShipView(addToHistory = false) {
    params.mode = 'ship';
    params.arg = analysis.patp;
    if (analysis.patp === search) {
      nav(linkToShip(analysis.patp), addToHistory);
    } else {
      nav(linkToShip(analysis.patp, { search }), addToHistory);
    }
  }
  function navToSearch(addToHistory = false) {
    if (!search) {
      navHome(addToHistory);
    } else if (analysis.queryIsValid) {
      params.mode = 'search';
      params.arg = search;
      nav(`/search/${search}`, addToHistory);
    }
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
  // $: urlChangedSinceAnalysisPatp = (urlChanged - analysisPatpChanged) > 1000;
  function autoNav() {
    if (params.mode !== 'chart' && search !== urlSearch) {
      if (urlChangedSinceAnalysisPatp) {
        search = urlSearch;
      } else if (analysis.search === search) {
        navigating = true;
        if (analysis.patpIsValid) {
          navToShipView(true);
        } else {
          navToSearch(params.mode === 'ship');
        }
      }
    }
  }
  $: urlSearch, analysis, autoNav();
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

  $: {
    if (analysis.search === urlSearch) {
      switch (params.mode) {
        case 'ship':
          $pageName = params.arg;
          break;
        case 'search':
          $pageName = 'Search';
          break;
        case 'chart':
          $pageName = 'Star Chart';
        default:
          $pageName = null;
      }
    }
  }


</script>

<div class="p-4 min-h-full flex flex-col items-center space-y-8 2xs:p-8">
  <SearchBar bind:analysis bind:search />
  <!-- <p class="bg-white">navigating</p> -->
  {#if params.mode == "chart"}
    <StarChart patp={analysis.patpIsValid ? analysis.patp : null} />
  {:else if analysis.patpIsValid}
    <ShipView patp={analysis.patp} />
  {:else if (analysis.queryIsValid)}
    <SearchResults query={analysis.query} search={analysis.search} />
  {:else if (analysis.search.length > 0)}
    <ValidationProblems problems={analysis.queryProblems} />
  {:else}
    <HomeScreenTiles />
  {/if}
  <!-- {/if} -->
</div>
