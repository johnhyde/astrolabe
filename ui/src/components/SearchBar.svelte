<script lang="ts">
  import ValidationErrors from './ValidationProblems.svelte';

  import { validateIdSearchText, convertIdSearchTextToQuery } from '../lib/id';

  export let searchText: string = 'der';
  export let searchQuery: RegExp = /~der/;
  let problems: Array<string> = [];

  $: {
    problems = validateIdSearchText(searchText);
    if (problems.length === 0) {
      searchQuery = convertIdSearchTextToQuery(searchText);
    } else {
      searchQuery = undefined;
    }
  }
</script>

<div class="flex justify-center">
  <div class="relative grow max-w-md rounded-full">
    <input type="text" class="p-4 py-2 w-full rounded-full"
      spellcheck="false"
      placeholder="Enter an ID or Azimuth number. '*' is wildcard."
      bind:value={searchText}
      />
    <button class="absolute right-0 w-10 h-10 rounded-full bg-black transition-opacity opacity-10 hover:opacity-40"></button>
  </div>
</div>

{#if searchText !== '' && problems.length > 0}
  <div class="flex justify-center">
    <ValidationErrors {problems}></ValidationErrors>
  </div>
{/if}
