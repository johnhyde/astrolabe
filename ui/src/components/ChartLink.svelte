<script lang="ts">
  import { link } from 'svelte-spa-router'
  import { linkToChart } from '../lib/link';

  export let patp = null;
</script>

<a href={linkToChart(patp)} use:link
  class="bg-navy text-white px-2 py-1 rounded no-underline">
  <slot/>
</a>
