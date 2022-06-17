<script lang="ts">

  import { SearchAnalysis } from '../lib/id';

  export let patp: string = undefined;
  export let searchQuery: RegExp = /~der/;
  export let analysis: SearchAnalysis = new SearchAnalysis();
  export let search = '';
  let debouncedSearch = search;

  const placeholderText = "Search by @p or #.  '*' is wildcard";

  $: {
    analysis = new SearchAnalysis(debouncedSearch);
    if (analysis.queryIsValid) {
      searchQuery = analysis.query;
    } else {
      searchQuery = undefined;
    }
    if (analysis.patpIsValid) {
      patp = analysis.patp;
    } else {
      patp = undefined;
    }
  }

  let timer;
  $: {
		clearTimeout(timer);
		timer = setTimeout(() => {
			debouncedSearch = search;
		}, 300);
	}
</script>

<div class="relative grow max-w-md rounded-full w-full">
  <input type="text" class="p-4 py-2 w-full rounded-full"
    spellcheck="false"
    placeholder={placeholderText}
    bind:value={search}
    autofocus
    />
  <button class="absolute right-0 w-10 h-10 rounded-full bg-black transition-opacity opacity-10 hover:opacity-40"></button>
</div>
