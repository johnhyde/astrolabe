<script lang="ts">
  import ValidationProblems from './ValidationProblems.svelte';

  import { SearchAnalysis, analyzeSearch } from '../lib/id';

  export let patp: string = undefined;
  export let searchQuery: RegExp = /~der/;
  let searchText = '';
  let analysis: SearchAnalysis;

  $: {
    analysis = analyzeSearch(searchText);
    if (analysis.queryIsValid) {
      searchQuery = analysis.query;
    } else {
      searchQuery = undefined;
    }
    if (analysis.patpIsValid) {
      patp = analysis.patp;
    } else {
      patp = undefined;
    }
  }
</script>

<div class="flex justify-center">
  <div class="relative grow max-w-md rounded-full">
    <input type="text" class="p-4 py-2 w-full rounded-full"
      spellcheck="false"
      placeholder="Enter an ID or Azimuth number. '*' is wildcard."
      bind:value={searchText}
      />
    <button class="absolute right-0 w-10 h-10 rounded-full bg-black transition-opacity opacity-10 hover:opacity-40"></button>
  </div>
</div>
<!-- <div class="bg-gray-300 p-2 rounded-lg">
  <p>
    text: {searchText}
  </p>
  <p>
    query: {searchQuery}
  </p>
</div> -->
{#if searchText !== '' && analysis && analysis.queryProblems.length > 0}
  <div class="flex justify-center">
    <ValidationProblems type="Query Problems" problems={analysis.queryProblems}></ValidationProblems>
  </div>
{/if}

<!-- {#if searchText !== '' && analysis && analysis.patpProblems.length > 0}
  <div class="flex justify-center">
    <ValidationProblems type="ID Problems" problems={analysis.patpProblems}></ValidationProblems>
  </div>
{/if} -->
