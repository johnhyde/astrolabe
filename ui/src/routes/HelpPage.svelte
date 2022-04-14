<script lang="ts">
  import { push } from 'svelte-spa-router';
  import Doc from '../components/Doc.svelte';
  export let params: any = {};
  $: path = params.path || '';

  // $: title = path ? capitalizeWords(path.replace(/-/g, ' ')) : 'Help';

  function closeDoc() {
    push('#/');
  }

  function navigate(event) {
    push(`#/help/${event.detail}`)
  }
</script>

<Doc {path} on:close={closeDoc} on:navigate={navigate} />
