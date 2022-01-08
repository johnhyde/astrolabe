<script lang="ts">
  import SearchBar from "./SearchBar.svelte";
  import SearchResults from "./SearchResults.svelte";
  let search: string = '';
</script>

<SearchBar bind:search />
{#if search == ''}
  <p>
    Hello, ~{window.ship}, would you like to search?
  </p>
{:else}
  <SearchResults {search} />
{/if}

<footer>
  Made by <a href="#/ship/~midlev-mindyr">~midlev-mindyr</a>.
</footer>