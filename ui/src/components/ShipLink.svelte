<script lang="ts">
  import { link } from 'svelte-spa-router'
  import { cite, normalizeId } from '../lib/id';
  import { linkToShip } from '../lib/link';
  export let patp: string;
  $: normalizedId = normalizeId(patp);
</script>

<a use:link={linkToShip(normalizedId)}>{cite(normalizedId)}</a>

