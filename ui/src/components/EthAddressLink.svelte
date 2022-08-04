<script lang="ts">
  import CopyToClipboard from 'svelte-copy-to-clipboard';
  import tooltip from 'actions/tooltip';

  let overrideText = null;

  const handleSuccessfullyCopied = (e) => {
    overrideText = 'Copied!';
    setTimeout(() => {
      overrideText = null;
    }, 2000);
  }

  const handleFailedCopy = () => {
      alert('failed to copy :(');
  }

  export let address: string = '';

  $: abbrevAddress = address ? address.slice(0, 6) + '...' + address.slice(-4) : '';
</script>

{#if address}
  <span use:tooltip={address}>
    <a href={`https://etherscan.io/address/${address}`} target="_blank">
      {overrideText || abbrevAddress}
    </a>
    
    <CopyToClipboard text={address} on:copy={handleSuccessfullyCopied} on:fail={handleFailedCopy} let:copy>
      <button on:click={copy} class="ml-1 text-3xl align-sub leading-4">⎘</button>
    </CopyToClipboard>
  </span>
{:else}
 <slot>
   Address empty
 </slot>
{/if}