<script lang="ts">
  import { link, replace } from 'svelte-spa-router'
  import { analyzeSearch, normalizeId } from '../lib/id';
  import { linkToShip } from '../lib/link';
  import SearchBar from "../components/SearchBar.svelte";
  import ShipView from '../components/ShipView.svelte';
  import ValidationProblems from '../components/ValidationProblems.svelte';
  export let params: any = {};

  $: patp = normalizeId(params.patp);
  $: analysis = analyzeSearch(params.patp);
  $: {
    if (analysis.patpIsValid && patp !== params.patp) {
      replace(linkToShip(patp));
    }
  }
</script>

<div class="m-8 flex flex-col space-y-8">
  <a use:link={"/"} class="p-4 bg-white rounded-lg text-center">Go Home</a>
  {#if analysis.patpIsValid}
  <ShipView patp={patp} />
  {:else}
    <ValidationProblems problems={analysis.patpProblems} />
  {/if}
</div>
