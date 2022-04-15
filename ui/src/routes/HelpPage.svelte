<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import docs from '../stores/docs';
  import Doc from '../components/docs/Doc.svelte';
  export let params: any = {};
  $: path = params.path || '';

  onMount(() => {
    docs.hide();
  });

  // $: title = path ? capitalizeWords(path.replace(/-/g, ' ')) : 'Help';

  function closeDoc() {
    push('#/');
  }

  function navigate(event) {
    push(`#/help/${event.detail}`)
  }
</script>

<div class="m-4 2xs:m-8 md:max-w-xl md:mx-auto">
  <Doc {path} on:close={closeDoc} on:navigate={navigate} />
</div>
