<script lang="ts">
  import { link, replace } from 'svelte-spa-router'
  import { validateId, normalizeId } from '../lib/id';
  import { linkToShip } from '../lib/link';
  import ShipView from '../components/ShipView.svelte';
  import ValidationErrors from '../components/ValidationProblems.svelte';
  export let params: any = {};

  $: patp = normalizeId(params.patp);
  $: problems = validateId(patp);
  $: patpIsValid = problems.length === 0;
  $: {
    if (patpIsValid && patp !== params.patp) {
      replace(linkToShip(patp));
    }
  }
</script>

<div class="m-8 flex flex-col space-y-8">
  <a use:link={"/"} class="p-4 bg-white rounded-lg text-center">Go Home</a>
  {#if patpIsValid}
  <ShipView patp={patp} />
  {:else}
    <ValidationErrors {problems} />
  {/if}
</div>
