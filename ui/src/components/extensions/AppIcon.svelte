<script lang="ts">
  import CopyToClipboard from 'svelte-copy-to-clipboard';
  import { uxToHex } from 'lib/utils';
  import { getAppByPath } from 'lib/apps';
  import store from 'stores/store';
  import LoadingSpinner from '@/common/LoadingSpinner.svelte';

  export let path: string;

  $: desk = path.split('/')[1];
  $: appPromise = getAppByPath(path);

  let overrideText = null;

  const handleSuccessfullyCopied = (e) => {
    overrideText = 'Copied!';
    setTimeout(() => {
      overrideText = null;
    }, 1000);
  }

  const handleFailedCopy = () => {
      alert('failed to copy :(');
  }
</script>

<div class="w-20 text-sm text-center">
  <div class="w-20 h-20 border border-gray-300 bg-gray-600 text-white rounded-lg overflow-hidden">
    {#await appPromise}
      <div class="flex h-full items-center">
        <LoadingSpinner />
      </div>
    {:then app}
      <a style:background-color={uxToHex(app.color)} class="block h-full w-full text-sm"
        href="web+urbitgraph://{path}" target="_blank"
      >
      {#if app.image}
        <img src={app.image} alt="app icon"
        class="aspect-square object-cover w-full h-full"
        />
        {/if}
      </a>
    {:catch}
    {path}
    {/await}
  </div>
  <CopyToClipboard text={path} on:copy={handleSuccessfullyCopied} on:fail={handleFailedCopy} let:copy>
    <span on:click={copy}>
      {#if overrideText}
        {overrideText}
      {:else}
        {#await appPromise}
          {desk}
        {:then app}
          <!-- {desk} -->
          {app.title}
        {/await}
      {/if}
    </span>
  </CopyToClipboard>
</div>
