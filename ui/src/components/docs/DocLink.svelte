<script lang="ts">
 
  import { createEventDispatcher } from 'svelte';
  export let path:string;
 
  const dispatch = createEventDispatcher();
  function navigate() {
    dispatch('navigate', path);
  }
</script>

<a href="javascript:void(0)" on:click={navigate}>
  <slot />
</a>
