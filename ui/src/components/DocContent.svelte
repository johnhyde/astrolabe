<script lang="ts">
 
  import { createEventDispatcher } from 'svelte';

  import docLinks from "../actions/docLinks";
  import docs from "../stores/docs";
 
  export let path:string;
 
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

<div class="doc">
  {#await docs.getDoc(path)}
  <h3>Loading page...</h3>
  {:then docHtml}
    <div use:docLinks={navigate}>
      {@html convertLinks(docHtml)}
    </div>
  {:catch error}
    <h1>Oops!</h1>
    <h2>Couldn't load the doc at /{path}</h2>
    <p>Please DM ~midlev-mindyr so he can fix this.</p>
  {/await}
</div>
