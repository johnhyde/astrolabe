<script lang="ts">
  import docs from '../stores/docs';
  import Doc from './Doc.svelte';

  // $: title = path ? capitalizeWords(path.replace(/-/g, ' ')) : 'Help';

</script>

{#if $docs.show}
<Doc path={$docs.path} on:close={() => docs.hide()} on:navigate={(event) => docs.show(event.detail)} />
{/if}
