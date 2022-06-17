<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let page: number;
  export let pageSize: number;
  export let totalPages: number;
  const dispatch = createEventDispatcher();

  function updatePage(page: number) {
    dispatch('updatePage', { page });
  }

  function visitPrevious() {
    updatePage(page - 1);
  }

  function visitNext() {
    updatePage(page + 1);
  }

  function seeList() {
    updatePage(null);
  }
</script>

{#if totalPages > 1}
  <div class="flex items-center px-8 max-w-md w-full">
    <div class="justify-self-start h-6">
        <button
          on:click={visitPrevious}
          class="h-6 w-12 bg-gold"
          class:invisible={!(page > 0)}
          style="
            clip-path: polygon(25% 0%, 0% 50%, 25% 100%, 100% 100%, 75% 50%, 100% 0%);
          "
          >
        </button>
    </div>
    <div class="grow">
      <slot/>
    </div>    
    <div class="justify-self-end h-6">
        <button
          on:click={visitNext}
          class="h-6 w-12 bg-gold"
          class:invisible={!(page < totalPages - 1)}
          style="
            
            clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
          "
          >
        </button>
    </div>
  </div>
{/if}
