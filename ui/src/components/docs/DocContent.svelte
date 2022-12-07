<script lang="ts">
 
  import { createEventDispatcher } from 'svelte';

  import docLinks from "actions/docLinks";
  import docs from "stores/docs";

  import LoadingSpinner from "@/common/LoadingSpinner.svelte";
 
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
     <LoadingSpinner spinnerClass="text-black" />
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
