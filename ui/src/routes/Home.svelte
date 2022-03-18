<script lang="ts">
  import SearchBar from "../components/SearchBar.svelte";
  import SearchResults from "../components/SearchResults.svelte";
  let patp: string;
  let searchQuery: RegExp;
</script>

<div class="m-8 flex flex-col space-y-8">
  <SearchBar bind:patp bind:searchQuery />
  <SearchResults {patp} {searchQuery}/>
</div>
