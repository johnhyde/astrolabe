<script lang="ts">
  import ShipLink from './ShipLink.svelte';

  export let shipChain: string[];
</script>

{#each shipChain as ship, index}
  {#if index > 0}{' > '}{/if}
  <ShipLink patp={ship}></ShipLink>
{/each}

