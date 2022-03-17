<script lang="ts">
  import SearchBar from "../components/SearchBar.svelte";
  import SearchResults from "../components/SearchResults.svelte";
  let searchText: string;
  let searchQuery: RegExp;
</script>

<div class="m-8 flex flex-col space-y-8">
  <SearchBar bind:searchText bind:searchQuery />
  <SearchResults bind:searchText {searchQuery}/>
</div>
