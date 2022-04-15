<script lang="ts">
  import { link, replace } from 'svelte-spa-router'
  import docs from '../stores/docs';
  import { SearchAnalysis } from '../lib/id';
  import { linkToShip } from '../lib/link';
  import SearchBar from "../components/SearchBar.svelte";
  import ShipView from '../components/ShipView.svelte';
  import ValidationProblems from '../components/ValidationProblems.svelte';
  import DocModal from '../components/docs/Doc.svelte';
  export let params: any = {};
  let patp: string;
  let analysis: SearchAnalysis = new SearchAnalysis();
  
  let search: string = params.patp || '';
  $: paramChanged = params.patp && Date.now();
  $: analysisPatpChanged = analysis.patp && Date.now();
  $: paramChangedMoreRecently = (paramChanged - analysisPatpChanged) > 1000;
  // $: search = params.patp || '';
  // $: patp = normalizeId(params.patp);
  // $: analysis = analyzeSearch(params.patp);
  $: {
    if (params.patp !== analysis.patp) {
      if (paramChangedMoreRecently) {
        search = params.patp;
      } else {
        if (analysis.patpIsValid && analysis.search === search) {
          replace(linkToShip(analysis.patp));
        }
      }
    }
    // if ()
  }
</script>

<div class="m-4 flex flex-col items-center space-y-8 2xs:m-8">
  <!-- <a use:link={"/"} class="p-4 bg-white rounded-lg text-center">Go Home</a> -->
  <!-- <SearchBar bind:searchText={search} bind:analysis /> -->
  <SearchBar bind:analysis bind:search />
  <div class="flex">
    <button class="bg-white" on:click={() => docs.show('urbit-id')}>urbit id</button>
    <button class="bg-white" on:click={() => docs.show('keys')}>key</button>
  </div>
  {#if analysis.patpIsValid}
    <ShipView patp={analysis.patp} />
  {:else if (search.length > 0)}
    <ValidationProblems problems={analysis.patpProblems} />
  {/if}
  <div class="flex">
    <button class="bg-white" on:click={() => docs.show('urbit-id')}>urbit id</button>
    <button class="bg-white" on:click={() => docs.show('keys')}>key</button>
  </div>
</div>
