<script lang="ts">
  import DocLink from './docs/DocLink.svelte';

  export let problems: Array<string> = [];
  export let type: string = undefined;
</script>

<div class="p-4 max-w-md rounded-lg bg-white w-full">
  {#if type}<b class="w-full text-center">{type}</b>{/if}
  <p>
    Sorry, the ID you entered is invalid:
  </p>
  {#each problems as problem}
    <p>
      {problem}
    </p>
  {/each}
  <p>
    <!-- TODO: add link to doc -->
    You can <DocLink modal path="patpee">read more here.</DocLink>
  </p>
</div>

