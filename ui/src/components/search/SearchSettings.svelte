<script lang="ts">
  import ToggleButton from '../buttons/ToggleButton.svelte';

  import { searchSettings } from 'stores/searchStores';
  import { toggleStoreKey } from 'lib/utils';

  function toggleMoons() {
    toggleStoreKey(searchSettings, 'includeMoons');
  }

  function toggleComets() {
    toggleStoreKey(searchSettings, 'includeComets');
  }
</script>

<div class="max-w-md rounded-lg bg-gold overflow-hidden flex flex-wrap items-center justify-center">
  <div class="px-4 py-2 flex gap-x-2 items-center border-navy">
    <span>Include Moons</span>  
    <ToggleButton on:click={toggleMoons} on={$searchSettings.includeMoons}></ToggleButton>
  </div>
  <div class="px-4 py-2 flex gap-x-2 items-center border-navy">
    <span>Include Comets</span>  
    <ToggleButton on:click={toggleComets} on={$searchSettings.includeComets}></ToggleButton>
  </div>
</div>
