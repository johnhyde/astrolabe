<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { link } from 'svelte-spa-router'
  import DocLink from './docs/DocLink.svelte';
 
  const dispatch = createEventDispatcher();
  function navigate(path) {
    dispatch('navigate', path);
  }

  function convertLinks(html: string): string {
    let converted = html;
    const externalLinkRegex = /href="http/g;
    converted = converted.replace(externalLinkRegex, 'target="_blank" href="http');
    return converted;
  }
</script>

<div class="pt-10 max-w-md w-full flex flex-wrap gap-5 justify-center">
  <div class="rounded-lg bg-white grow max-w-xs">
    <DocLink modal path="astrolabe">
      <div class="p-5 text-xl text-center">
        About Astrolabe
      </div>
    </DocLink>
  </div>
  <div class="rounded-lg bg-white grow max-w-xs">
    <DocLink modal path="">
      <div class="p-5 text-xl text-center">
        About Urbit IDs
      </div>
    </DocLink>
  </div>
  <a class="rounded-lg bg-navy border border-gold grow max-w-s" use:link href="/chart">
    <p class="p-5 text-xl text-center text-white">
      <br/>
      Star Chart
      <br/>
      <br/>
    </p>
  </a>
</div>
