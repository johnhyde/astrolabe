<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import DocContent from './DocContent.svelte';
  import Hamburger from './buttons/Hamburger.svelte';
  
  export let path: string;
  
  const dispatch = createEventDispatcher();
  function close() {
    dispatch('close');
  }

  function navigate(path) {
    dispatch('navigate', path);
  }
</script>

<div class="p-8 rounded-lg bg-white">
  <div class="flex">
    <Hamburger />
    <div class="flex-grow text-center text-xl">
      Help
    </div>
    <button class="w-10" on:click={close}>
      X
    </button>
  </div>
  <DocContent {path} on:navigate />
</div>
