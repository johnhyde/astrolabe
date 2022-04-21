<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import docs from '../../stores/docs';

  export let path:string;
  export let modal:boolean = false;
  export let asLink:boolean = true;
  export let enabled:boolean = true;
 
  const dispatch = createEventDispatcher();
  function navigate() {
    if (modal) {
      docs.show(path);
    } else {
      dispatch('navigate', path);
    }
  }
</script>

{#if enabled}
  <a class:no-underline={!asLink} href="javascript:void(0)" on:click={navigate}>
    <slot />
  </a>
{:else}
  <slot />
{/if}
