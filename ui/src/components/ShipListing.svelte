<script lang="ts">
  import Sigil from "./Sigil.svelte";
  export let ship: any;
</script>

<div class="flex flex-wrap p-4 border-b last:border-none items-center"
  on:click
  >
  <Sigil patp={ship.patp} size={48} />
  <!-- {#if ship.avatar}
    <img src={ship.avatar} class="h-12 w-12 mr-4" />
  {/if} -->
  <p class="ml-4 break-words" >
    {ship.patp}<br/>{ship.nickname ? `(${ship.nickname})` : ''}
  </p>
</div>