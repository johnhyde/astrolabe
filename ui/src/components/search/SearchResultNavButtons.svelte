<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let index: number;
  export let totalResults: number;
  const dispatch = createEventDispatcher();

  function updateIndex(index: number) {
    dispatch('updateIndex', { index });
  }

  function visitPrevious() {
    updateIndex(index - 1);
  }

  function visitNext() {
    updateIndex(index + 1);
  }

  function seeList() {
    updateIndex(null);
  }
</script>

<div class="flex justify-center">
  <div class="grid grid-cols-3 h-6 mx-8 max-w-md w-full" >
    <div class="justify-self-start">
      {#if index > 0}
        <button
          on:click={visitPrevious}
          class="h-6 w-12 bg-white"
          style="
            clip-path: polygon(25% 0%, 0% 50%, 25% 100%, 100% 100%, 75% 50%, 100% 0%);
          "
          >
        </button>
      {/if}
    </div>
    <div class="text-center">
      <button
        on:click={seeList}
        class="-mt-2 h-8 w-12 bg-white"
        style="
          clip-path: polygon(0% 100%, 0% 66%, 50% 0%, 100% 66%, 100% 100%, 78% 100%, 50% 66%, 22% 100%);
        "
        >
      </button>
    </div>
    <div class="justify-self-end">
      {#if index < totalResults - 1}
        <button
          on:click={visitNext}
          class="h-6 w-12 bg-white"
          style="
            clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);
          "
          >
        </button>
      {/if}
    </div>
  </div>
</div>
