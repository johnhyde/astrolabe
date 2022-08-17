<script lang="ts">
  import SigilInput from './sigil/SigilInput.svelte';


  import { SearchAnalysis } from 'lib/id';
  import { SigilQuery } from 'lib/sigil';

  export let patp: string = undefined;
  export let searchQuery: RegExp = /~der/;
  export let analysis: SearchAnalysis = new SearchAnalysis();
  export let search = '';
  export let sigilQuery: SigilQuery = new SigilQuery('planet');
  export let pauseAnalysis: boolean = false;
  export let placeholderText = "Search by @p or #.  '*' matches any character";
  
  let debouncedSearch = search;
  let showSigilInput: boolean = false;

  $: {
    if (!pauseAnalysis) {
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
  }

  $: {
    if (showSigilInput && sigilQuery.isDefinitive) {
      const querySyls = sigilQuery.query.flat();
      search = '~' + querySyls[0];
      if (querySyls.length > 1) {
        search += querySyls[1];
        if (querySyls.length > 2) {
          search += '-' + querySyls[2] + '-' + querySyls[3];
        }
      }
    }
  }

  let timer;
  $: {
		clearTimeout(timer);
		timer = setTimeout(() => {
			debouncedSearch = search;
		}, 300);
	}

  function openSigilInput() {
    showSigilInput = true;
  }

  function closeSigilInput() {
    showSigilInput = false;
  }
</script>

<div class="relative max-w-md w-full">
  {#if showSigilInput}
    <div class="rounded-2xl bg-white overflow-hidden">
      <SigilInput bind:sigilQuery></SigilInput>
    </div>
    <button
      on:click={closeSigilInput}
      class="absolute top-2 right-2 w-20 h-6 rounded-full bg-black transition-opacity opacity-10 hover:opacity-40"
    />
  {:else}
    <input type="text" class="p-4 py-2 w-full rounded-full"
      spellcheck="false"
      placeholder={placeholderText}
      bind:value={search}
      autofocus
    />
    <button
      on:click={openSigilInput}
      class="absolute top-1 right-1 w-8 h-8 rounded-full bg-black transition-opacity opacity-10 hover:opacity-40"
    />
  {/if}
</div>
