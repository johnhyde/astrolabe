<script lang="ts">
  import { link, push, replace, querystring } from 'svelte-spa-router'
  import pageName from '../stores/pageName';
  import { SearchAnalysis } from '../lib/id';
  import { linkToShip } from '../lib/link';
  import SearchBar from "../components/SearchBar.svelte";
  import SearchResults from "../components/SearchResults.svelte";
  import ShipView from '../components/ShipView.svelte';
  import ValidationProblems from '../components/ValidationProblems.svelte';
  import HomeScreenTiles from '../components/HomeScreenTiles.svelte';
  export let params: any = {};
  let analysis: SearchAnalysis = new SearchAnalysis();
  
  $: querySearch = (new URLSearchParams($querystring)).get('search');
  function getSearch() {
    return querySearch || params.search || params.patp || '';
  }
  $: urlSearch = querySearch || params.search || params.patp || '';
  let search: string = getSearch();
  $: urlChanged = (urlSearch || true) && Date.now();
  $: analysisPatpChanged = (analysis.patp || true) && Date.now();
  $: urlChangedSinceAnalysisPatp = (urlChanged - analysisPatpChanged) > 1000;
  $: {
    if (search !== urlSearch) {
      if (urlChangedSinceAnalysisPatp) {
        search = urlSearch;
      } else if (analysis.search === search) {
        if (analysis.patpIsValid) {
          if (analysis.patp === search) {
            push(linkToShip(analysis.patp));
          } else {
            push(linkToShip(analysis.patp, { search }));
          }
        } else {
          const nav = params.patp !== undefined ? push : replace;
          if (!search) {
            nav('/');
          } else if (analysis.queryIsValid) {
            nav(`/search/${search}`);
          }
        }
      }
    }
  }

  $: {
    $pageName =  params.patp !== undefined ? params.patp : (search ? 'Search' : null);
  }


</script>

<div class="m-4 flex flex-col items-center space-y-8 2xs:m-8">
  <SearchBar bind:analysis bind:search />
  {#if analysis.patpIsValid}
    <ShipView patp={analysis.patp} />
  {:else if (analysis.queryIsValid)}
    <SearchResults query={analysis.query} search={analysis.search} />
  {:else if (analysis.search.length > 0)}
    <ValidationProblems problems={analysis.queryProblems} />
  {:else}
    <HomeScreenTiles />
  {/if}
</div>
