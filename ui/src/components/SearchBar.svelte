<script lang="ts">
  import { validateId } from '../lib/id';

  export let search: string = "";
  let problems: Array<string> = [];

  function updateSearch(e) {
    let newSearch = e.target.value;
    problems = validateId(newSearch);
    if (problems.length === 0) {
      search = newSearch;
    }
  }
</script>

<div class="flex justify-center">
  <input type="text" class="m-8 px-4 py-2 grow max-w-md rounded-full"
    placeholder="Enter an ID or Azimuth number. '*' is wildcard."
    value={search} 
    on:change={updateSearch}
    />
</div>

<div class="m-8">
  {#if problems.length > 0}
    <p>
      Sorry, the ID you entered is invalid:
    </p>
    {#each problems as problem}
      <p>
        {problem}
      </p>
    {/each}
    <p>
      <!-- TODO: add link to doc -->
      You can read more here.
    </p>
  {/if}
</div>
