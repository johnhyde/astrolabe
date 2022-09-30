<script lang="ts">
  import SigilInput from './sigil/SigilInput.svelte';
  import Symbol from './sigil/Symbol.svelte';

  import { SearchAnalysis } from 'lib/id';
  import { SigilQuery } from 'lib/sigil';

  export let patp: string = undefined;
  export let analysis: SearchAnalysis = new SearchAnalysis();
  export let search = '';
  export let sigilQuery: SigilQuery = new SigilQuery('planet');
  sigilQuery.urlString = search;
  export let searchMode: ('patp' | 'sigil') = 'patp';
  export let placeholderText = "Search by @p or #.  '*' matches any character";

  $: showSigilInput = searchMode == 'sigil';
  
  let bouncySearch: string = search;
  let debouncedSearch: string = bouncySearch;

  let timer;
  $: {
    if (!showSigilInput){
      if (bouncySearch !== search) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          search = bouncySearch;
        }, 300);
      }
    }
  }

  function updateSigilUrlString() {
    if (showSigilInput) {
      if (search !== sigilQuery.urlString) {
        sigilQuery.urlString = search;
      }
    }
  }

  function updateSigilSearch() {
    if (showSigilInput) {
      if (sigilQuery.isNotEmpty) {
        search = sigilQuery.urlString;
      } else {
        search = '';
      }
    }
  }

  $: search, updateSigilUrlString();
  $: sigilQuery.urlString, updateSigilSearch();

  $: {
    if (showSigilInput) {
      if (sigilQuery.isDefinitive) {
        patp = sigilQuery.patp;
      } else {
        patp = undefined;
      }
    } else {
      analysis = new SearchAnalysis(search);
      if (analysis.patpIsValid) {
        patp = analysis.patp;
      } else {
        patp = undefined;
      }
      bouncySearch = search = analysis.search;
    }
  }

  function openSigilInput() {
    searchMode = 'sigil';
  }

  function closeSigilInput() {
    searchMode = 'patp';
    bouncySearch = patp || analysis.search;
    debouncedSearch = bouncySearch;
    search = debouncedSearch;
  }
</script>

<div class="relative max-w-md w-full">
  {#if showSigilInput}
    <div class="rounded-2xl bg-white overflow-hidden">
      <SigilInput bind:sigilQuery></SigilInput>
    </div>
    <button
      on:click={closeSigilInput}
      class="absolute top-2 right-2 w-20 h-6 rounded-full bg-black text-white text-sm transition-opacity opacity-50 hover:opacity-80"
    >
      patp or #
    </button>
  {:else}
    <input type="text" class="p-4 py-2 w-full rounded-full"
      spellcheck="false"
      placeholder={placeholderText}
      on:input={(e) => bouncySearch = e.target.value}
      value={search}
      autofocus
    />
    <button
      on:click={openSigilInput}
      class="absolute top-1 right-1 w-8 h-8 transition-opacity opacity-50 hover:opacity-80"
    >
      <Symbol components={'gci.lvf.lhf.lbhb.atrf4.al3.cbl2lf.cbl2mb'.split('.')} size={32}
        altBgColor="transparent"
        />
    </button>
  {/if}
</div>
