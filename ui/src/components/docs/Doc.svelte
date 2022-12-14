<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import DocContent from './DocContent.svelte';
  import DocHome from './DocHome.svelte';
  import Hamburger from '@/buttons/Hamburger.svelte';
  import CloseButton from '@/buttons/CloseButton.svelte';
  import keys from 'stores/keys';
  
  export let path: string;

  $: homePage = path === '';
  
  const dispatch = createEventDispatcher();
  function close() {
    dispatch('close');
  }

  function navigate(path) {
    dispatch('navigate', path);
  }

  $: {
    $keys.globalkeyup.get('escape').set('doc', close);
  }

  onDestroy(() => {
    $keys.globalkeyup.get('escape').delete('doc');
	});
</script>

<div class="rounded-lg bg-white">
  <div class="flex p-4 border-navy">
    {#if !homePage}
      <Hamburger on:click={() => navigate('')} />
    {:else}
      <div class="w-7 h-7" />
    {/if}
    <div class="grow text-center text-xl">
      Help
    </div>
    <CloseButton on:click={close} />
  </div>
  <div class="p-8 pt-0">
    {#if !homePage}
      <DocContent {path} on:navigate />
    {:else}
      <DocHome on:navigate />
    {/if}
  </div>
</div>
