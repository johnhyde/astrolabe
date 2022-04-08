<script lang="ts">
  import store from '../stores/store';

  export let path:string;
</script>

<div class="doc">
  {#await store.getDoc(path)}
    <h3>Loading page...</h3>
  {:then docHtml}
    {@html docHtml}
  {:catch error}
    <h1>Oops!</h1>
    <h2>Couldn't load the doc at /{path}</h2>
    <p>Please DM ~midlev-mindyr so he can fix this.</p>
  {/await}
</div>
